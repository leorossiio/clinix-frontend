import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConsultaService } from '../../../features/consultas/services/consulta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cancelar-consulta',
  templateUrl: './modal-cancelar-consulta.component.html',
  styleUrls: ['./modal-cancelar-consulta.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ModalCancelarConsultaComponent {
  @Input() show = false;
  @Input() consulta: any; // consulta que será cancelada
  @Output() close = new EventEmitter<void>();
  @Output() cancelamentoConfirmado = new EventEmitter<void>();

  motivoCancelamento: string = '';

  constructor(private consultaService: ConsultaService) {}

  onCancelar() {
    this.close.emit();
    this.resetarCampos();
  }

  onConfirmar() {
    if (!this.motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    this.consultaService.cancelarConsulta(this.consulta.id_consulta, { motivo_cancelamento: this.motivoCancelamento })
      .subscribe({
        next: () => {
          alert('Consulta cancelada com sucesso.');
          this.cancelamentoConfirmado.emit();
          this.onCancelar();
        },
        error: (err) => {
          console.error('Erro ao cancelar consulta:', err);
          alert('Erro ao cancelar consulta. Tente novamente.');
        }
      });
  }

  resetarCampos() {
    this.motivoCancelamento = '';
  }
}