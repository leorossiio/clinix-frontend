import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../../core/feedback/feedback.service';

/** Exibe os avisos do FeedbackService. Incluído uma única vez, no AppComponent. */
@Component({
  selector: 'app-toasts',
  template: `
    <div class="pilha" aria-live="polite" aria-atomic="false">
      @for (mensagem of feedback.mensagens(); track mensagem.id) {
        <div class="toast" [class.toast--erro]="mensagem.tipo === 'erro'" role="status">
          <span>{{ mensagem.texto }}</span>
          <button type="button" aria-label="Fechar aviso" (click)="feedback.fechar(mensagem.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .pilha {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: min(420px, calc(100vw - 32px));
    }
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--raio-pequeno);
      background: var(--cor-sucesso);
      color: #fff;
      box-shadow: var(--sombra-forte);
    }
    .toast--erro {
      background: var(--cor-perigo);
    }
    button {
      border: none;
      background: none;
      color: inherit;
      font-size: 1.3rem;
      cursor: pointer;
    }
  `,
})
export class ToastsComponent {
  protected readonly feedback = inject(FeedbackService);
}
