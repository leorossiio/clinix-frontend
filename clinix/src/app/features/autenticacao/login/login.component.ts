import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AutenticacaoService } from '../../../core/autenticacao/autenticacao.service';
import { mensagemDeErro } from '../../../core/feedback/mensagem-de-erro';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: '../pagina-de-acesso.css',
})
export class LoginComponent {
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);
  private readonly parametros = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });
  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly mostrarSenha = signal(false);
  protected readonly sessaoExpirada = this.parametros.get('sessao') === 'expirada';

  protected entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { email, senha } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.erro.set(null);

    this.autenticacao
      .entrar(email, senha)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(this.destinoAposLogin()),
        error: (erro) => this.erro.set(mensagemDeErro(erro, 'Não foi possível entrar.')),
      });
  }

  protected campoInvalido(nome: 'email' | 'senha'): boolean {
    const campo = this.formulario.controls[nome];
    return campo.invalid && campo.touched;
  }

  /**
   * Só aceita caminhos internos ("/usuarios"). "//site.com" e URLs absolutas
   * permitiriam usar a tela de login para redirecionar vítimas a outro site.
   */
  private destinoAposLogin(): string {
    const retorno = this.parametros.get('retorno');
    return retorno?.startsWith('/') && !retorno.startsWith('//') ? retorno : '/consultas';
  }
}
