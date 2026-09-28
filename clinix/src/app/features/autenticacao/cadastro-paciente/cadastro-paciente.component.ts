import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { mensagemDeErro } from '../../../core/feedback/mensagem-de-erro';
import { IconeComponent } from '../../../shared/ui/icone/icone.component';
import { PainelDeAcessoComponent } from '../painel-de-acesso/painel-de-acesso.component';
import { UsuarioService } from '../../usuarios/usuario.service';
import { senhasIguais } from './senhas-iguais.validator';

/** Auto-cadastro público. Sempre cria um paciente (médicos são cadastrados pela clínica). */
@Component({
  selector: 'app-cadastro-paciente',
  imports: [ReactiveFormsModule, RouterLink, IconeComponent, PainelDeAcessoComponent],
  templateUrl: './cadastro-paciente.component.html',
  styleUrl: '../pagina-de-acesso.css',
})
export class CadastroPacienteComponent {
  private readonly usuarios = inject(UsuarioService);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);

  protected readonly formulario = inject(NonNullableFormBuilder).group(
    {
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
      confirmacao: ['', Validators.required],
    },
    { validators: senhasIguais },
  );
  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly mostrarSenha = signal(false);

  protected cadastrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { nome, email, senha } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.erro.set(null);

    this.usuarios
      .cadastrarPaciente({ nome, email, senha })
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          this.feedback.sucesso('Conta criada. Entre com seu e-mail e senha.');
          void this.router.navigate(['/login']);
        },
        error: (erro) =>
          this.erro.set(mensagemDeErro(erro, 'Não foi possível concluir o cadastro.')),
      });
  }

  protected campoInvalido(nome: 'nome' | 'email' | 'senha' | 'confirmacao'): boolean {
    const campo = this.formulario.controls[nome];
    return campo.invalid && campo.touched;
  }

  protected get senhasDiferentes(): boolean {
    return (
      this.formulario.hasError('senhasDiferentes') && this.formulario.controls.confirmacao.touched
    );
  }
}
