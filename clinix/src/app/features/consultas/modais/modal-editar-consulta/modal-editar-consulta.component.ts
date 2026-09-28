import { Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Consulta, EdicaoDeConsulta } from '../../../../core/modelos/consulta';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { paraDatetimeLocal, paraInstanteIso } from '../../../../shared/utils/datas';

/**
 * Edita data e descrição. Só envia à API o que mudou: reenviar a data de uma
 * consulta que já passou seria recusado ("não pode ir para o passado").
 */
@Component({
  selector: 'app-modal-editar-consulta',
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal titulo="Editar consulta" (fechar)="fechar.emit()">
      <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
        <div class="campo">
          <label for="data">Data e horário</label>
          <input id="data" type="datetime-local" formControlName="data" />
        </div>
        <div class="campo">
          <label for="descricao">Descrição</label>
          <input id="descricao" formControlName="descricao" maxlength="255" />
        </div>
        <div class="acoes-do-modal">
          <button type="button" class="botao botao--secundario" (click)="fechar.emit()">
            Voltar
          </button>
          <button type="submit" class="botao botao--primario" [disabled]="enviando()">
            Salvar
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styleUrl: '../modais.css',
})
export class ModalEditarConsultaComponent implements OnInit {
  readonly consulta = input.required<Consulta>();
  readonly enviando = input(false);
  readonly salvar = output<EdicaoDeConsulta>();
  readonly fechar = output<void>();

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    data: ['', Validators.required],
    descricao: [''],
  });

  ngOnInit(): void {
    this.formulario.setValue({
      data: paraDatetimeLocal(this.consulta().data),
      descricao: this.consulta().descricao ?? '',
    });
  }

  protected enviar(): void {
    const { data, descricao } = this.formulario.controls;
    if (this.formulario.invalid) return;
    const alteracoes: EdicaoDeConsulta = {};
    if (data.dirty) alteracoes.data = paraInstanteIso(data.value);
    if (descricao.dirty) alteracoes.descricao = descricao.value.trim();
    if (Object.keys(alteracoes).length === 0) {
      this.fechar.emit();
      return;
    }
    this.salvar.emit(alteracoes);
  }
}
