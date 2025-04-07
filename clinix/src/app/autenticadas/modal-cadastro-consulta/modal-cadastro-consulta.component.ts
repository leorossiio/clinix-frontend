import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cadastro-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-cadastro-consulta.component.html',
  styleUrls: ['./modal-cadastro-consulta.component.css']
})
export class ModalCadastroConsultaComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  dataHoraConsulta: string = '';
  especialidade: string = '';
  medicoResponsavel: string = '';
  descricaoConsulta: string = '';

  onSalvar() {
    const dados = {
      dataHoraConsulta: this.dataHoraConsulta,
      especialidade: this.especialidade,
      medicoResponsavel: this.medicoResponsavel
    };
    this.salvar.emit(dados);
    this.resetarCampos();
  }

  onClose() {
    this.close.emit();
    this.resetarCampos();
  }

  resetarCampos() {
    this.dataHoraConsulta = '';
    this.especialidade = '';
    this.medicoResponsavel = '';
  }
}
