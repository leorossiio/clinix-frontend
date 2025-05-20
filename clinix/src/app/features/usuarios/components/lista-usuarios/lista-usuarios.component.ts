import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  nome: string;
  tipo_usuario: number; // 0: Paciente, 1: Médico, 2: Admin
  email: string;
  senha: string;
  status: number; // 0: Ativo, 1: Deletado
}

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent {
  filtro: string = '';

  usuarios: Usuario[] = [
    { nome: 'João', tipo_usuario: 0, email: 'joao@gmail.com', senha: '123456', status: 0 },
    { nome: 'Maria', tipo_usuario: 1, email: 'maria@gmail.com', senha: 'abc123', status: 0 },
    { nome: 'Carlos', tipo_usuario: 2, email: 'admin@clinix.com', senha: 'admin', status: 1 }
  ];

  get usuariosFiltrados() {
    const filtroLower = this.filtro.toLowerCase();
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(filtroLower) ||
      u.email.toLowerCase().includes(filtroLower) ||
      this.tipoUsuarioToString(u.tipo_usuario).toLowerCase().includes(filtroLower) ||
      this.statusToString(u.status).toLowerCase().includes(filtroLower)
    );
  }

  editandoIndex: number | null = null;
  usuarioEditado: Usuario = {
  nome: '',
  tipo_usuario: 0,
  email: '',
  senha: '',
  status: 0
};

editarUsuario(index: number) {
  this.editandoIndex = index;
  this.usuarioEditado = { ...this.usuarios[index] };
}

cancelarEdicao() {
  this.editandoIndex = null;
}

salvarEdicao(index: number) {
  this.usuarios[index] = { ...this.usuarioEditado };
  this.editandoIndex = null;
}

  tipoUsuarioToString(tipo: number): string {
    return tipo === 0 ? 'Paciente' : tipo === 1 ? 'Médico' : 'Admin';
  }

  statusToString(status: number): string {
    return status === 0 ? 'Ativo' : 'Deletado';
  }

  esconderSenha(senha: string): string {
    return '*'.repeat(senha.length);
  }
}
