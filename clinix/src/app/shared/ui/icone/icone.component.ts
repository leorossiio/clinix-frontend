import { Component, computed, input } from '@angular/core';

/** Traços no grid 24×24, no estilo de linha contínua (stroke), herdando a cor do texto. */
const ICONES = {
  mais: ['M12 5v14', 'M5 12h14'],
  busca: ['M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14Z', 'm20 20-4.2-4.2'],
  sair: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  editar: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
  excluir: [
    'M3 6h18',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'm19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  ],
  fechar: ['M18 6 6 18', 'm6 6 12 12'],
  olho: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z'],
  'olho-fechado': [
    'm3 3 18 18',
    'M10.6 5.1Q11.3 5 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.1 4',
    'M6.6 6.6A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6',
    'M9.9 9.9a3 3 0 0 0 4.2 4.2',
  ],
  relogio: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M12 7v5l3 2'],
  calendario: [
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'M16 2v4M8 2v4M3 10h18',
  ],
  reagendar: ['M3 7v6h6', 'M3 13a9 9 0 1 0 3-7.7L3 8'],
  sucesso: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'm8 12 3 3 5-6'],
  erro: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M12 8v4', 'M12 16h.01'],
} as const;

export type NomeDoIcone = keyof typeof ICONES;

/** Ícone decorativo. O significado deve estar no texto ou no aria-label do botão. */
@Component({
  selector: 'app-icone',
  template: `
    <svg
      [attr.width]="tamanho()"
      [attr.height]="tamanho()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (caminho of caminhos(); track $index) {
        <path [attr.d]="caminho" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class IconeComponent {
  readonly nome = input.required<NomeDoIcone>();
  readonly tamanho = input(18);

  protected readonly caminhos = computed(() => ICONES[this.nome()]);
}
