import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ModalAtualizacaoUsuarioComponent } from '../../../modais/modal-atualizacao-usuario/modal-atualizacao-usuario.component';

const EspecialidadeMedica: { [key: number]: string } = {
  0: 'Cardiologia',
  1: 'Pediatria',
  2: 'Ortopedia',
  3: 'Dermatologia',
  4: 'Neurologia'
};

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
  filtro: string = '';
  usuarioSelecionado: Usuario | null = null;
  modalAberto: boolean = false;
  especialidades = EspecialidadeMedica;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: dados => {
        this.usuarios = dados;
        this.usuariosFiltrados = dados;
      },
      error: err => {
        console.error('Erro ao buscar usuários:', err);
        alert('Erro ao carregar usuários.');
      }
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
      const especialidade = usuario.tipo_usuario === 1
        ? this.especialidades[usuario.especialidade as number]?.toLowerCase() ?? ''
        : '';
      const status = this.labelStatus(usuario.status).toLowerCase();

      return (
        nome.includes(termo) ||
        email.includes(termo) ||
        tipo.includes(termo) ||
        crm.includes(termo) ||
        especialidade.includes(termo) ||
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

  abrirModalEdicao(usuario: Usuario): void {
    this.usuarioSelecionado = { ...usuario };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.usuarioSelecionado = null;
  }

  atualizarUsuario(usuarioEditado: Partial<Usuario> & { id_usuario: string }): void {
    const { id_usuario, nome, email, senha } = usuarioEditado;

    this.usuarioService.atualizarUsuario(id_usuario, { nome, email, senha }).subscribe({
      next: () => {
        const index = this.usuarios.findIndex(u => u.id_usuario === id_usuario);
        if (index !== -1) {
          this.usuarios[index] = {
            ...this.usuarios[index],
            nome: nome ?? this.usuarios[index].nome,
            email: email ?? this.usuarios[index].email
          };
          this.aplicarFiltro();
        }
        alert('Usuário atualizado com sucesso!');
        this.fecharModal();
      },
      error: err => {
        console.error('Erro ao atualizar usuário:', err);
        alert('Erro ao atualizar usuário.');
      }
    });
  }

  deletarUsuario(usuario: Usuario): void {
    const confirmado = confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`);
    if (!confirmado) return;

    this.usuarioService.deletarUsuario(usuario.id_usuario!).subscribe({
      next: () => {
        alert('Usuário deletado com sucesso!');
        this.listarUsuarios();
      },
      error: err => {
        console.error('Erro ao deletar usuário:', err);
        alert('Erro ao deletar o usuário.');
      }
    });
  }
}