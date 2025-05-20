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
  @Input() id_usuario: string = '';
  @Input() id_medico: string = '';


  dataHoraConsulta: string = '';
  descricaoConsulta: string = '';

  onSalvar() {
  const dados = {
    dataHoraConsulta: this.dataHoraConsulta,
    descricao: this.descricaoConsulta,
    id_usuario: this.id_usuario,
    id_medico: this.id_medico
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
  this.descricaoConsulta = '';
}

}
