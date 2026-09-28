import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import {
  AtualizacaoDeUsuario,
  ROTULO_DO_TIPO,
  TipoUsuario,
  Usuario,
  nomeDaEspecialidade,
} from '../../../core/modelos/usuario';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';
import { UsuarioService } from '../usuario.service';
import { normalizarParaBusca } from '../../../shared/utils/texto';

/** Administração de usuários (rota restrita a administradores). */
@Component({
  selector: 'app-lista-usuarios',
  imports: [FormsModule, ModalEditarUsuarioComponent],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css',
})
export class ListaUsuariosComponent implements OnInit {
  private readonly service = inject(UsuarioService);
  private readonly feedback = inject(FeedbackService);

  protected readonly idDoAdminLogado = inject(SessaoService).usuario()?.id;
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly carregando = signal(true);
  protected readonly busca = signal('');
  protected readonly emEdicao = signal<Usuario | null>(null);
  protected readonly salvando = signal(false);

  protected readonly visiveis = computed(() => {
    const termo = normalizarParaBusca(this.busca());
    return this.usuarios().filter((usuario) =>
      [
        usuario.nome,
        usuario.email,
        this.perfil(usuario),
        this.especialidade(usuario),
        usuario.crm,
      ].some((valor) => normalizarParaBusca(valor).includes(termo)),
    );
  });

  ngOnInit(): void {
    this.carregar();
  }

  protected perfil(usuario: Usuario): string {
    return ROTULO_DO_TIPO[usuario.tipo_usuario];
  }

  protected especialidade(usuario: Usuario): string {
    return usuario.tipo_usuario === TipoUsuario.MEDICO
      ? nomeDaEspecialidade(usuario.especialidade)
      : '—';
  }

  protected salvar(usuario: Usuario, alteracoes: AtualizacaoDeUsuario): void {
    this.salvando.set(true);
    this.service
      .atualizar(usuario.id_usuario, alteracoes)
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
        next: () => {
          this.feedback.sucesso('Usuário atualizado.');
          this.emEdicao.set(null);
          this.carregar();
        },
        error: (erro) => this.feedback.erro(erro),
      });
  }

  protected excluir(usuario: Usuario): void {
    if (!this.feedback.confirmar(`Excluir ${usuario.nome}? A pessoa perderá o acesso na hora.`)) {
      return;
    }
    this.service.excluir(usuario.id_usuario).subscribe({
      next: () => {
        this.feedback.sucesso('Usuário excluído.');
        this.carregar();
      },
      error: (erro) => this.feedback.erro(erro),
    });
  }

  private carregar(): void {
    this.service
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (usuarios) => this.usuarios.set(usuarios),
        error: (erro) => this.feedback.erro(erro, 'Não foi possível carregar os usuários.'),
      });
  }
}
