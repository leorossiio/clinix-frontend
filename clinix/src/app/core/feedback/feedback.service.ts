import { Injectable, signal } from '@angular/core';
import { mensagemDeErro } from './mensagem-de-erro';

export interface MensagemDeFeedback {
  id: number;
  tipo: 'sucesso' | 'erro';
  texto: string;
}

const DURACAO_MS = 5000;

/**
 * Avisos não bloqueantes (toasts), exibidos pelo ToastsComponent na raiz da
 * aplicação. Substitui os alert() espalhados pela versão anterior.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private proximoId = 0;
  private readonly lista = signal<MensagemDeFeedback[]>([]);

  readonly mensagens = this.lista.asReadonly();

  sucesso(texto: string): void {
    this.exibir('sucesso', texto);
  }

  /** Aceita um texto ou o próprio erro HTTP, cuja mensagem vem da API. */
  erro(erroOuTexto: unknown, padrao?: string): void {
    const texto =
      typeof erroOuTexto === 'string' ? erroOuTexto : mensagemDeErro(erroOuTexto, padrao);
    this.exibir('erro', texto);
  }

  fechar(id: number): void {
    this.lista.update((mensagens) => mensagens.filter((m) => m.id !== id));
  }

  /** Confirmação para ações destrutivas. Centralizada aqui para ser trocável e testável. */
  confirmar(pergunta: string): boolean {
    return window.confirm(pergunta);
  }

  private exibir(tipo: MensagemDeFeedback['tipo'], texto: string): void {
    const id = ++this.proximoId;
    this.lista.update((mensagens) => [...mensagens, { id, tipo, texto }]);
    setTimeout(() => this.fechar(id), DURACAO_MS);
  }
}
