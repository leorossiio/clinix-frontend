import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-modal-atualizacao-consulta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-atualizacao-consulta.component.html',
  styleUrls: ['./modal-atualizacao-consulta.component.css']
})
export class ModalAtualizacaoConsultaComponent {
  @Input() show: boolean = false;
  @Input() consulta: any;

  @Output() close = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  atualizar() {
    this.salvar.emit(this.consulta);
  }

  fechar() {
    this.close.emit();
  }
}
