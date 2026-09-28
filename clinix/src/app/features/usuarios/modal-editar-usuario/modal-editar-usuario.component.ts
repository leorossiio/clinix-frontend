import { Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AtualizacaoDeUsuario, Usuario } from '../../../core/modelos/usuario';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

/** Edita nome, e-mail e, opcionalmente, define uma nova senha. Envia só o que mudou. */
@Component({
  selector: 'app-modal-editar-usuario',
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal titulo="Editar usuário" (fechar)="fechar.emit()">
      <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
        <div class="campo">
          <label for="nome">Nome</label>
          <input id="nome" formControlName="nome" [attr.aria-invalid]="invalido('nome')" />
          @if (invalido('nome')) {
            <span class="campo__erro">Informe o nome.</span>
          }
        </div>
        <div class="campo">
          <label for="email">E-mail</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [attr.aria-invalid]="invalido('email')"
          />
          @if (invalido('email')) {
            <span class="campo__erro">Informe um e-mail válido.</span>
          }
        </div>
        <div class="campo">
          <label for="senha">Nova senha</label>
          <input
            id="senha"
            type="password"
            formControlName="senha"
            autocomplete="new-password"
            aria-describedby="ajuda-senha"
            [attr.aria-invalid]="invalido('senha')"
          />
          @if (invalido('senha')) {
            <span class="campo__erro">A senha deve ter entre 6 e 72 caracteres.</span>
          } @else {
            <span id="ajuda-senha" class="campo__ajuda">Deixe em branco para manter a atual.</span>
          }
        </div>
        <div class="acoes">
          <button type="button" class="botao botao--neutro" (click)="fechar.emit()">Voltar</button>
          <button type="submit" class="botao botao--primario" [disabled]="enviando()">
            Salvar
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styles: `
    .acoes {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `,
})
export class ModalEditarUsuarioComponent implements OnInit {
  readonly usuario = input.required<Usuario>();
  readonly enviando = input(false);
  readonly salvar = output<AtualizacaoDeUsuario>();
  readonly fechar = output<void>();

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.minLength(6), Validators.maxLength(72)]],
  });

  ngOnInit(): void {
    const { nome, email } = this.usuario();
    this.formulario.patchValue({ nome, email });
  }

  protected invalido(campo: 'nome' | 'email' | 'senha'): boolean {
    const controle = this.formulario.controls[campo];
    return controle.invalid && controle.touched;
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { nome, email, senha } = this.formulario.controls;
    const alteracoes: AtualizacaoDeUsuario = {};
    if (nome.dirty) alteracoes.nome = nome.value.trim();
    if (email.dirty) alteracoes.email = email.value.trim();
    if (senha.value) alteracoes.senha = senha.value;
    if (Object.keys(alteracoes).length === 0) {
      this.fechar.emit();
      return;
    }
    this.salvar.emit(alteracoes);
  }
}
