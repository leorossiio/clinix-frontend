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
import { SEM_ACOES, acoesDaConsulta } from '../acoes-da-consulta';
import { CartaoDeConsultaComponent } from '../cartao-de-consulta/cartao-de-consulta.component';
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
 * livres + próprias consultas; médico: a própria agenda; admin: tudo), então
 * aqui só se filtra, exibe e dispara ações.
 */
@Component({
  selector: 'app-pagina-consultas',
  imports: [
    FormsModule,
    CartaoDeConsultaComponent,
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
  protected readonly status = Object.values(StatusConsulta).map((valor) => ({
    valor,
    rotulo: ROTULO_DO_STATUS[valor],
  }));

  protected readonly consultas = signal<Consulta[]>([]);
  protected readonly carregando = signal(true);
  protected readonly falhouAoCarregar = signal(false);
  /** Id da consulta com ação em andamento (evita clique duplo). */
  protected readonly emAndamento = signal<string | null>(null);
  protected readonly modal = signal<ModalAberto | null>(null);

  /**
   * Consultas filtradas já com as ações de cada uma, calculadas uma vez por
   * mudança de estado (e não a cada ciclo de renderização). Sem sessão — por
   * um instante, ao clicar em "Sair" — nenhuma ação é oferecida.
   */
  protected readonly visiveis = computed(() => {
    const usuario = this.usuario();
    const agora = new Date();
    return filtrarConsultas(this.consultas(), this.filtros.filtro()).map((consulta) => ({
      consulta,
      acoes: usuario ? acoesDaConsulta(consulta, usuario, agora) : SEM_ACOES,
    }));
  });
  protected readonly abrindoHorario = computed(() => this.modal()?.tipo === 'nova');
  protected readonly consultaEmEdicao = computed(() => this.consultaDoModal('editar'));
  protected readonly consultaEmCancelamento = computed(() => this.consultaDoModal('cancelar'));
  protected readonly ehPaciente = computed(() => this.usuario()?.tipo === TipoUsuario.PACIENTE);
  protected readonly ehAdmin = computed(() => this.usuario()?.tipo === TipoUsuario.ADMIN);

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

  protected agendar(consulta: Consulta): void {
    if (!this.feedback.confirmar(`Agendar a consulta com ${this.nomeDoMedico(consulta)}?`)) return;
    this.executar(
      consulta.id_consulta,
      this.service.agendar(consulta.id_consulta),
      'Consulta agendada!',
    );
  }

  protected reagendar(consulta: Consulta): void {
    if (!this.feedback.confirmar(`Reagendar a consulta com ${this.nomeDoMedico(consulta)}?`))
      return;
    this.executar(
      consulta.id_consulta,
      this.service.reagendar(consulta.id_consulta),
      'Consulta reagendada!',
    );
  }

  protected remover(consulta: Consulta): void {
    const pergunta = `Remover a consulta de ${this.nomeDoMedico(consulta)} da agenda? O paciente não poderá desfazer.`;
    if (!this.feedback.confirmar(pergunta)) return;
    this.executar(
      consulta.id_consulta,
      this.service.remover(consulta.id_consulta),
      'Consulta removida.',
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
