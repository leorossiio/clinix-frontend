import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Consulta, ROTULO_DO_STATUS, StatusConsulta } from '../../../core/modelos/consulta';
import { nomeDaEspecialidade } from '../../../core/modelos/usuario';
import { AcoesDaConsulta } from '../acoes-da-consulta';

const CLASSE_DO_STATUS: Record<StatusConsulta, string> = {
  [StatusConsulta.DISPONIVEL]: 'status--disponivel',
  [StatusConsulta.AGENDADA]: 'status--agendada',
  [StatusConsulta.CONCLUIDA]: 'status--concluida',
  [StatusConsulta.CANCELADA]: 'status--cancelada',
};

/** Exibe uma consulta e emite as ações escolhidas; não conhece HTTP nem regras. */
@Component({
  selector: 'app-cartao-de-consulta',
  imports: [DatePipe],
  templateUrl: './cartao-de-consulta.component.html',
  styleUrl: './cartao-de-consulta.component.css',
})
export class CartaoDeConsultaComponent {
  readonly consulta = input.required<Consulta>();
  readonly acoes = input.required<AcoesDaConsulta>();
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
  protected readonly cancelada = computed(
    () => this.consulta().status === StatusConsulta.CANCELADA,
  );
}
