import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'modal-atualizacao-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-atualizacao-usuario.component.html',
  styleUrls: ['./modal-atualizacao-usuario.component.css']
})
export class ModalAtualizacaoUsuarioComponent {
  @Input() usuario: Usuario | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Partial<Usuario> & { id_usuario: string }>();

  salvarAlteracoes(): void {
    if (this.usuario) {
      const { id_usuario, nome, email, senha } = this.usuario;

      this.salvar.emit({ id_usuario, nome, email, senha });
      this.fechar.emit();
    }
  }
}