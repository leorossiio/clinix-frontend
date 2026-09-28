import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { IconeComponent } from '../icone/icone.component';

/** Exibe os avisos do FeedbackService. Incluído uma única vez, no AppComponent. */
@Component({
  selector: 'app-toasts',
  imports: [IconeComponent],
  template: `
    <div class="pilha" aria-live="polite" aria-atomic="false">
      @for (mensagem of feedback.mensagens(); track mensagem.id) {
        <div class="toast" [class.toast--erro]="mensagem.tipo === 'erro'" role="status">
          <app-icone
            class="simbolo"
            [nome]="mensagem.tipo === 'erro' ? 'erro' : 'sucesso'"
            [tamanho]="20"
          />
          <span class="texto">{{ mensagem.texto }}</span>
          <button
            type="button"
            class="botao botao--discreto botao--icone"
            aria-label="Fechar aviso"
            (click)="feedback.fechar(mensagem.id)"
          >
            <app-icone nome="fechar" [tamanho]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .pilha {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: min(400px, calc(100vw - 32px));
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 8px 12px 16px;
      background: var(--papel);
      border: 1px solid var(--linha);
      border-radius: 14px;
      box-shadow: var(--sombra-elevada);
      animation: entrar 200ms ease-out;
    }
    .simbolo {
      margin-top: 1px;
      color: var(--hortela);
    }
    .toast--erro .simbolo {
      color: var(--rosa);
    }
    .texto {
      flex: 1;
      padding-top: 1px;
      font-size: 0.92rem;
    }
    .botao {
      width: 28px;
      height: 28px;
      margin-top: -3px;
      color: var(--tinta-fraca);
    }
    @keyframes entrar {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `,
})
export class ToastsComponent {
  protected readonly feedback = inject(FeedbackService);
}
