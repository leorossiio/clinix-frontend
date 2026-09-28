import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Consulta, ROTULO_DO_STATUS, StatusConsulta } from '../../../core/modelos/consulta';
import { nomeDaEspecialidade } from '../../../core/modelos/usuario';
import { FolhaDeCalendarioComponent } from '../../../shared/ui/folha-de-calendario/folha-de-calendario.component';
import { IconeComponent } from '../../../shared/ui/icone/icone.component';
import { AcoesDaConsulta } from '../acoes-da-consulta';

const CLASSE_DO_STATUS: Record<StatusConsulta, string> = {
  [StatusConsulta.DISPONIVEL]: 'chip--disponivel',
  [StatusConsulta.AGENDADA]: 'chip--agendada',
  [StatusConsulta.CONCLUIDA]: 'chip--concluida',
  [StatusConsulta.CANCELADA]: 'chip--cancelada',
};

/**
 * Exibe uma consulta e emite as ações escolhidas; não conhece HTTP nem regras.
 *
 * - "bilhete": destaque com folha de calendário, para as consultas do paciente;
 * - "linha": uma entrada na agenda do dia (o dia já aparece no título do grupo).
 */
@Component({
  selector: 'app-consulta',
  imports: [DatePipe, FolhaDeCalendarioComponent, IconeComponent],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css',
})
export class ConsultaComponent {
  readonly consulta = input.required<Consulta>();
  readonly acoes = input.required<AcoesDaConsulta>();
  readonly modo = input<'bilhete' | 'linha'>('linha');
  /** Na agenda da clínica, mostra quem agendou (ou que o horário está livre). */
  readonly mostrarPaciente = input(false);
  /**
   * Na agenda do próprio médico, o nome dele em cada linha é ruído: a linha
   * destaca o paciente (ou que o horário está livre).
   */
  readonly destacarPaciente = input(false);
  /** Desabilita os botões enquanto uma ação sobre esta consulta está em andamento. */
  readonly ocupado = input(false);

  readonly agendar = output<void>();
  readonly cancelar = output<void>();
  readonly reagendar = output<void>();
  readonly editar = output<void>();
  readonly remover = output<void>();

  protected readonly rotuloDoStatus = computed(() => ROTULO_DO_STATUS[this.consulta().status]);
  protected readonly classeDoStatus = computed(() => CLASSE_DO_STATUS[this.consulta().status]);
  protected readonly especialidade = computed(() =>
    nomeDaEspecialidade(this.consulta().medico?.especialidade),
  );
  protected readonly classeDaEspecialidade = computed(
    () => `especialidade--${this.consulta().medico?.especialidade ?? 'nenhuma'}`,
  );
  protected readonly cancelada = computed(
    () => this.consulta().status === StatusConsulta.CANCELADA,
  );
  /** No bilhete e na agenda da clínica; na lista de horários livres, todos estão disponíveis. */
  protected readonly mostraSituacao = computed(
    () => this.modo() === 'bilhete' || this.mostrarPaciente(),
  );
  protected readonly temAcoes = computed(() => {
    const { agendar, cancelar, reagendar, editar, remover } = this.acoes();
    return agendar || cancelar || reagendar || editar || remover;
  });
}
