import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { NovaConsulta } from '../../../../core/modelos/consulta';
import { Usuario, nomeDaEspecialidade } from '../../../../core/modelos/usuario';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { paraDatetimeLocal, paraInstanteIso } from '../../../../shared/utils/datas';
import { UsuarioService } from '../../../usuarios/usuario.service';

/**
 * Abre um horário na agenda. O médico sempre abre na própria agenda (a API
 * ignora outra escolha); o administrador escolhe o médico.
 */
@Component({
  selector: 'app-modal-nova-consulta',
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal titulo="Novo horário" (fechar)="fechar.emit()">
      <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
        @if (escolherMedico()) {
          <div class="campo">
            <label for="medico">Médico</label>
            <select
              id="medico"
              formControlName="idMedico"
              [attr.aria-invalid]="invalido('idMedico')"
            >
              <option value="" disabled>Selecione…</option>
              @for (medico of medicos(); track medico.id_usuario) {
                <option [value]="medico.id_usuario">
                  {{ medico.nome }} — {{ especialidade(medico.especialidade) }}
                </option>
              }
            </select>
            @if (invalido('idMedico')) {
              <span class="campo__erro">Selecione o médico.</span>
            }
          </div>
        }
        <div class="campo">
          <label for="data">Data e horário</label>
          <input
            id="data"
            type="datetime-local"
            formControlName="data"
            [min]="agora"
            [attr.aria-invalid]="invalido('data')"
          />
          @if (invalido('data')) {
            <span class="campo__erro">Informe uma data futura.</span>
          }
        </div>
        <div class="campo">
          <label for="descricao">Descrição <small>(opcional)</small></label>
          <input id="descricao" formControlName="descricao" maxlength="255" />
        </div>
        <div class="acoes-do-modal">
          <button type="button" class="botao botao--neutro" (click)="fechar.emit()">Voltar</button>
          <button type="submit" class="botao botao--primario" [disabled]="enviando()">
            Abrir horário
          </button>
        </div>
      </form>
    </app-modal>
  `,
  styleUrl: '../modais.css',
})
export class ModalNovaConsultaComponent implements OnInit {
  private readonly usuarios = inject(UsuarioService);
  private readonly feedback = inject(FeedbackService);

  /** Só o administrador escolhe o médico. */
  readonly escolherMedico = input(false);
  readonly enviando = input(false);
  readonly salvar = output<NovaConsulta>();
  readonly fechar = output<void>();

  protected readonly medicos = signal<Usuario[]>([]);
  protected readonly agora = paraDatetimeLocal(new Date());
  protected readonly especialidade = nomeDaEspecialidade;
  protected readonly formulario = inject(NonNullableFormBuilder).group({
    idMedico: [''],
    data: ['', Validators.required],
    descricao: [''],
  });

  ngOnInit(): void {
    if (!this.escolherMedico()) return;
    this.formulario.controls.idMedico.addValidators(Validators.required);
    this.usuarios.listarMedicos().subscribe({
      next: (medicos) => this.medicos.set(medicos),
      error: (erro) => this.feedback.erro(erro, 'Não foi possível carregar os médicos.'),
    });
  }

  protected invalido(campo: 'idMedico' | 'data'): boolean {
    const controle = this.formulario.controls[campo];
    return controle.invalid && controle.touched;
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { idMedico, data, descricao } = this.formulario.getRawValue();
    this.salvar.emit({
      ...(this.escolherMedico() ? { id_medico: idMedico } : {}),
      data: paraInstanteIso(data),
      descricao: descricao.trim(),
    });
  }
}
