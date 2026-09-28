import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import {
  Consulta,
  EdicaoDeConsulta,
  NovaConsulta,
  ROTULO_DO_STATUS,
  StatusConsulta,
} from '../../../core/modelos/consulta';
import { ESPECIALIDADES, TipoUsuario } from '../../../core/modelos/usuario';
import { IconeComponent } from '../../../shared/ui/icone/icone.component';
import { primeiroNome } from '../../../shared/utils/texto';
import { AcoesDaConsulta, SEM_ACOES, acoesDaConsulta } from '../acoes-da-consulta';
import { agruparPorDia, separarParaPaciente } from '../agenda';
import { ConsultaComponent } from '../consulta/consulta.component';
import { ConsultaService } from '../consulta.service';
import { filtrarConsultas } from '../filtro-de-consultas';
import { FiltrosDeConsultasStore } from '../filtros-de-consultas.store';
import { ModalCancelarConsultaComponent } from '../modais/modal-cancelar-consulta/modal-cancelar-consulta.component';
import { ModalEditarConsultaComponent } from '../modais/modal-editar-consulta/modal-editar-consulta.component';
import { ModalNovaConsultaComponent } from '../modais/modal-nova-consulta/modal-nova-consulta.component';

type ModalAberto =
  | { tipo: 'nova' }
  | { tipo: 'editar'; consulta: Consulta }
  | { tipo: 'cancelar'; consulta: Consulta };

/**
 * Tela principal. A API já devolve o recorte do perfil (paciente: horários
 * livres + próprias consultas; médico: a própria agenda; admin: tudo); aqui
 * elas são organizadas como agenda, filtradas e recebem as ações.
 *
 * - Paciente: "Suas consultas" em destaque, depois os horários livres por dia.
 * - Médico e administrador: a agenda inteira por dia, com a situação de cada horário.
 */
@Component({
  selector: 'app-pagina-consultas',
  imports: [
    FormsModule,
    IconeComponent,
    ConsultaComponent,
    ModalNovaConsultaComponent,
    ModalEditarConsultaComponent,
    ModalCancelarConsultaComponent,
  ],
  templateUrl: './pagina-consultas.component.html',
  styleUrl: './pagina-consultas.component.css',
})
export class PaginaConsultasComponent implements OnInit {
  private readonly service = inject(ConsultaService);
  private readonly feedback = inject(FeedbackService);
  private readonly usuario = inject(SessaoService).usuario;

  protected readonly filtros = inject(FiltrosDeConsultasStore);
  protected readonly especialidades = ESPECIALIDADES;
  protected readonly situacoes = Object.values(StatusConsulta).map((valor) => ({
    valor,
    rotulo: ROTULO_DO_STATUS[valor],
  }));

  protected readonly consultas = signal<Consulta[]>([]);
  protected readonly carregando = signal(true);
  protected readonly falhouAoCarregar = signal(false);
  /** Id da consulta com ação em andamento (evita clique duplo). */
  protected readonly emAndamento = signal<string | null>(null);
  protected readonly modal = signal<ModalAberto | null>(null);

  protected readonly ehPaciente = computed(() => this.usuario()?.tipo === TipoUsuario.PACIENTE);
  protected readonly ehAdmin = computed(() => this.usuario()?.tipo === TipoUsuario.ADMIN);
  protected readonly ehMedico = computed(() => this.usuario()?.tipo === TipoUsuario.MEDICO);
  /** Médicos veem só a própria agenda: filtrar por especialidade não faz sentido para eles. */
  protected readonly filtraEspecialidade = computed(() => !this.ehMedico());
  protected readonly dicaDaBusca = computed(() => {
    if (this.ehPaciente()) return 'Médico, especialidade ou descrição';
    return this.ehAdmin() ? 'Médico, paciente ou descrição' : 'Paciente ou descrição';
  });

  private readonly separacao = computed(() =>
    separarParaPaciente(this.consultas(), this.usuario()?.id ?? ''),
  );

  /** Consultas do paciente logado (qualquer situação). Não passam pelos filtros. */
  protected readonly proprias = computed(() =>
    this.ehPaciente() ? this.separacao().proprias : [],
  );

  /** Horários livres (paciente) ou agenda completa (clínica), filtrados e agrupados por dia. */
  protected readonly dias = computed(() => {
    const base = this.ehPaciente() ? this.separacao().livres : this.consultas();
    return agruparPorDia(filtrarConsultas(base, this.filtros.filtro()), new Date());
  });
  protected readonly totalNaAgenda = computed(() =>
    this.dias().reduce((total, dia) => total + dia.consultas.length, 0),
  );

  /** Ações de cada consulta, recalculadas só quando a lista ou a sessão mudam. */
  private readonly acoesPorConsulta = computed(() => {
    const usuario = this.usuario();
    const agora = new Date();
    return new Map(
      this.consultas().map((c) => [
        c.id_consulta,
        usuario ? acoesDaConsulta(c, usuario, agora) : SEM_ACOES,
      ]),
    );
  });

  protected readonly titulo = computed(() =>
    this.ehPaciente() ? `Olá, ${primeiroNome(this.usuario()?.nome ?? '')}` : 'Agenda',
  );
  protected readonly subtitulo = computed(() => {
    if (!this.ehPaciente()) {
      // Total da agenda, não o filtrado: o subtítulo descreve a agenda, não a busca.
      const total = this.consultas().length;
      const horarios = total === 1 ? '1 horário' : `${total} horários`;
      return this.ehAdmin()
        ? `${horarios} na agenda de todos os médicos.`
        : `${horarios} na sua agenda.`;
    }
    const agendadas = this.proprias().filter((c) => c.status === StatusConsulta.AGENDADA).length;
    if (agendadas === 0) return 'Escolha um horário para agendar sua consulta.';
    return agendadas === 1
      ? 'Você tem uma consulta agendada.'
      : `Você tem ${agendadas} consultas agendadas.`;
  });

  protected readonly abrindoHorario = computed(() => this.modal()?.tipo === 'nova');
  protected readonly consultaEmEdicao = computed(() => this.consultaDoModal('editar'));
  protected readonly consultaEmCancelamento = computed(() => this.consultaDoModal('cancelar'));

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.falhouAoCarregar.set(false);
    this.service
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (consultas) => this.consultas.set(consultas),
        error: (erro) => {
          this.falhouAoCarregar.set(true);
          this.feedback.erro(erro, 'Não foi possível carregar as consultas.');
        },
      });
  }

  protected acoesDe(consulta: Consulta): AcoesDaConsulta {
    return this.acoesPorConsulta().get(consulta.id_consulta) ?? SEM_ACOES;
  }

  protected agendar(consulta: Consulta): void {
    if (!this.feedback.confirmar(`Agendar a consulta com ${this.nomeDoMedico(consulta)}?`)) return;
    this.executar(
      consulta.id_consulta,
      this.service.agendar(consulta.id_consulta),
      'Consulta agendada.',
    );
  }

  protected reagendar(consulta: Consulta): void {
    if (!this.feedback.confirmar(`Reagendar a consulta com ${this.nomeDoMedico(consulta)}?`)) {
      return;
    }
    this.executar(
      consulta.id_consulta,
      this.service.reagendar(consulta.id_consulta),
      'Consulta reagendada.',
    );
  }

  protected remover(consulta: Consulta): void {
    const pergunta = `Remover a consulta de ${this.nomeDoMedico(consulta)} da agenda? O paciente não poderá desfazer.`;
    if (!this.feedback.confirmar(pergunta)) return;
    this.executar(
      consulta.id_consulta,
      this.service.remover(consulta.id_consulta),
      'Consulta removida da agenda.',
    );
  }

  protected confirmarCancelamento(consulta: Consulta, motivo: string): void {
    this.executar(
      consulta.id_consulta,
      this.service.cancelar(consulta.id_consulta, motivo),
      'Consulta cancelada. Você pode reagendá-la em até 3 dias.',
    );
  }

  protected salvarEdicao(consulta: Consulta, alteracoes: EdicaoDeConsulta): void {
    this.executar(
      consulta.id_consulta,
      this.service.editar(consulta.id_consulta, alteracoes),
      'Consulta atualizada.',
    );
  }

  protected abrirHorario(nova: NovaConsulta): void {
    this.executar('nova', this.service.abrirHorario(nova), 'Horário aberto na agenda.');
  }

  /**
   * Executa uma ação, avisa o resultado e recarrega a lista inteira: uma
   * ação pode mudar outras consultas (ex.: qual é "reagendável").
   */
  private executar(id: string, acao: Observable<unknown>, sucesso: string): void {
    this.emAndamento.set(id);
    acao.pipe(finalize(() => this.emAndamento.set(null))).subscribe({
      next: () => {
        this.feedback.sucesso(sucesso);
        this.modal.set(null);
        this.carregar();
      },
      error: (erro) => {
        this.feedback.erro(erro);
        this.carregar();
      },
    });
  }

  private consultaDoModal(tipo: 'editar' | 'cancelar'): Consulta | null {
    const modal = this.modal();
    return modal?.tipo === tipo ? modal.consulta : null;
  }

  private nomeDoMedico(consulta: Consulta): string {
    return consulta.medico?.nome ?? 'o médico';
  }
}
