import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() consulta: any;
  @Output() close = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<string>();

  motivoCancelamento: string = '';

  constructor() {}

  onCancelar(): void {
    this.close.emit();
    this.motivoCancelamento = '';
  }

  onConfirmar(): void {
    if (!this.motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }
    this.confirmar.emit(this.motivoCancelamento);
  }
}