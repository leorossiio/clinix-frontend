import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Folha de calendário destacável: o elemento de identidade do Clinix.
 * Mostra mês, dia e dia da semana de uma data, como numa agenda de papel.
 */
@Component({
  selector: 'app-folha-de-calendario',
  imports: [DatePipe],
  template: `
    <time class="folha" [class.folha--grande]="grande()" [attr.datetime]="data()">
      <span class="mes">{{ data() | date: 'MMM' }}</span>
      <span class="dia">{{ data() | date: 'dd' }}</span>
      <span class="semana">{{ data() | date: 'EEE' }}</span>
    </time>
  `,
  styles: `
    .folha {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 64px;
      overflow: hidden;
      background: var(--papel);
      border: 1px solid var(--linha);
      border-radius: 12px;
      box-shadow: 0 1px 0 var(--linha);
      text-align: center;
    }
    .mes {
      width: 100%;
      padding: 3px 0 2px;
      background: var(--anil);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
    }
    .dia {
      font-family: var(--fonte-titulo);
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
      color: var(--tinta);
    }
    .semana {
      padding-bottom: 6px;
      font-size: 0.72rem;
      color: var(--tinta-fraca);
    }
    .folha--grande {
      width: 132px;
      border-radius: 20px;
      border: none;
      box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.45);
    }
    .folha--grande .mes {
      padding: 8px 0 6px;
      font-size: 0.95rem;
    }
    .folha--grande .dia {
      font-size: 4rem;
      line-height: 1.05;
    }
    .folha--grande .semana {
      padding-bottom: 14px;
      font-size: 0.95rem;
    }
  `,
})
export class FolhaDeCalendarioComponent {
  /** Instante ISO 8601; exibido no fuso do navegador. */
  readonly data = input.required<string>();
  readonly grande = input(false);
}
