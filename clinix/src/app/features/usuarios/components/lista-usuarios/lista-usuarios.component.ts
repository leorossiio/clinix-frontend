import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';

// módulos necessários para standalone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// componentes compartilhados
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

import { ModalAtualizacaoUsuarioComponent } from '../modal-atualizacao-usuario/modal-atualizacao-usuario.component';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ModalAtualizacaoUsuarioComponent
  ]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtro = '';
  usuarioSelecionado: Usuario | null = null;
  modalAberto: boolean = false;
console: any;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: dados => {
        console.log('Usuários recebidos:', dados);
        this.usuarios = dados;
        this.aplicarFiltro(); // mostra todos inicialmente
      },
      error: err => console.error('Falha ao buscar usuários', err)
    });
  }

  aplicarFiltro(): void {
    const termo = this.filtro.toLowerCase().trim();

    if (!termo) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const nome = usuario.nome?.toLowerCase() ?? '';
      const email = usuario.email?.toLowerCase() ?? '';
      const tipo = this.labelTipo(usuario.tipo_usuario).toLowerCase();
      const crm = usuario.crm?.toLowerCase() ?? '';
      const status = this.labelStatus(usuario.status).toLowerCase();

      return (
        nome.includes(termo) ||
        email.includes(termo) ||
        tipo.includes(termo) ||
        crm.includes(termo) ||
        status.includes(termo)
      );
    });
  }



  labelTipo(tipo: number): string {
    return ['Paciente', 'Médico', 'Admin'][tipo] ?? '-';
  }

  labelStatus(status: number): string {
    return status === 0 ? 'Ativo' : 'Deletado';
  }

  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuário:', usuario);
  }

  deletarUsuario(usuario: Usuario): void {
    console.log('Deletar usuário:', usuario);
  }

  abrirModalEdicao(usuario: Usuario): void {
    console.log('Abrindo modal para:', usuario.nome);
    this.usuarioSelecionado = { ...usuario }; // clone para edição
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.usuarioSelecionado = null;
  }
  atualizarUsuario(usuarioEditado: Usuario): void {
    this.usuarioService.atualizarUsuario(usuarioEditado.id_usuario, usuarioEditado).subscribe({
      next: () => {
        // Atualiza na lista local
        const index = this.usuarios.findIndex(u => u.id_usuario === usuarioEditado.id_usuario);
        if (index !== -1) {
          this.usuarios[index] = { ...usuarioEditado };
          this.aplicarFiltro();
        }
        alert('Usuário atualizado com sucesso!');
      },
      error: err => {
        console.log('Enviando para o backend:', usuarioEditado);
        console.error('Erro ao atualizar usuário:', err);
        alert('Erro ao atualizar usuário.');
      }
    });
  }

}
