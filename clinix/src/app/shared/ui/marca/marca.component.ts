import { Component, input } from '@angular/core';

/**
 * Marca do Clinix em vetor: a cruz menta com o coração, redesenhada a partir
 * do logo original (docs/marca/logo-original.png), que tem brilho e fundo
 * embutidos e perde a nitidez em tamanhos pequenos.
 */
@Component({
  selector: 'app-marca',
  template: `
    <svg [attr.width]="tamanho()" [attr.height]="tamanho()" viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="#2e9e90"
        d="M12.5 3h7a2 2 0 0 1 2 2v5.5H27a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5.5V27a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-5.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h5.5V5a2 2 0 0 1 2-2Z"
      />
      <path
        fill="#fff"
        d="M16 21.6s-5.4-3.3-5.4-6.9a2.9 2.9 0 0 1 5.4-1.5 2.9 2.9 0 0 1 5.4 1.5c0 3.6-5.4 6.9-5.4 6.9Z"
      />
    </svg>
    <span class="nome" [class.nome--claro]="clara()">Clinix</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .nome {
      font-family: var(--fonte-titulo);
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--tinta);
    }
    .nome--claro {
      color: #fff;
    }
  `,
})
export class MarcaComponent {
  readonly tamanho = input(30);
  /** Para fundos escuros. */
  readonly clara = input(false);
}
