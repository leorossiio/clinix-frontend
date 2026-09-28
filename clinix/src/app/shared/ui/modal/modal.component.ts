import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';

let contador = 0;

/**
 * Janela modal acessível: role="dialog", título anunciado por leitores de
 * tela, foco movido para dentro ao abrir e fechamento com Esc ou clique fora.
 *
 * Uso: <app-modal titulo="Cancelar consulta" (fechar)="...">conteúdo</app-modal>
 * Para exibir/ocultar, envolva em @if no componente pai.
 */
@Component({
  selector: 'app-modal',
  template: `
    <div class="fundo" aria-hidden="true" (click)="fechar.emit()"></div>
    <div
      #janela
      class="janela"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      [attr.aria-labelledby]="idDoTitulo"
    >
      <header>
        <h2 [id]="idDoTitulo">{{ titulo() }}</h2>
        <button type="button" class="fechar" aria-label="Fechar" (click)="fechar.emit()">×</button>
      </header>
      <ng-content />
    </div>
  `,
  styleUrl: './modal.component.css',
  host: { '(document:keydown.escape)': 'fechar.emit()' },
})
export class ModalComponent implements AfterViewInit {
  readonly titulo = input.required<string>();
  readonly fechar = output<void>();

  protected readonly idDoTitulo = `modal-titulo-${++contador}`;
  private readonly janela = viewChild.required<ElementRef<HTMLElement>>('janela');

  ngAfterViewInit(): void {
    const primeiroCampo =
      this.janela().nativeElement.querySelector<HTMLElement>('input, select, textarea');
    (primeiroCampo ?? this.janela().nativeElement).focus();
  }
}
