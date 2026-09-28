import { Component, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Consulta } from '../../../../core/modelos/consulta';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-modal-cancelar-consulta',
  imports: [ModalComponent, ReactiveFormsModule, DatePipe],
  template: `
    <app-modal titulo="Cancelar consulta" (fechar)="fechar.emit()">
      <p class="resumo">
        {{ consulta().medico?.nome }} —
        {{ consulta().data | date: "dd/MM/yyyy 'às' HH:mm" }}
      </p>
      <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
        <div class="campo">
          <label for="motivo">Motivo do cancelamento</label>
          <textarea
            id="motivo"
            formControlName="motivo"
            rows="4"
            maxlength="255"
            [attr.aria-invalid]="motivoInvalido()"
          ></textarea>
          @if (motivoInvalido()) {
            <span class="campo__erro">Informe o motivo do cancelamento.</span>
          }
        </div>
        <div class="acoes-do-modal">
          <button type="button" class="botao botao--neutro" (click)="fechar.emit()">Voltar</button>
          <button type="submit" class="botao botao--perigo" [disabled]="enviando()">
            Confirmar cancelamento
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styleUrl: '../modais.css',
})
export class ModalCancelarConsultaComponent {
  readonly consulta = input.required<Consulta>();
  readonly enviando = input(false);
  readonly confirmar = output<string>();
  readonly fechar = output<void>();

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    motivo: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  protected motivoInvalido(): boolean {
    const campo = this.formulario.controls.motivo;
    return campo.invalid && campo.touched;
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.confirmar.emit(this.formulario.getRawValue().motivo.trim());
  }
}
