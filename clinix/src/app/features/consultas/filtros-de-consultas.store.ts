import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { SessaoService } from '../../core/autenticacao/sessao.service';
import { FILTRO_VAZIO, FiltroDeConsultas } from './filtro-de-consultas';

/**
 * Estado dos filtros da tela de consultas (CLINIXSM-43). Por ser um serviço
 * da raiz, sobrevive à navegação entre páginas: ao voltar para "Consultas",
 * os filtros continuam aplicados. É zerado quando o usuário da sessão muda.
 */
@Injectable({ providedIn: 'root' })
export class FiltrosDeConsultasStore {
  private readonly estado = signal<FiltroDeConsultas>(FILTRO_VAZIO);

  readonly filtro = this.estado.asReadonly();
  readonly algumAtivo = computed(() =>
    Object.entries(this.estado()).some(
      ([chave, valor]) => valor !== FILTRO_VAZIO[chave as keyof FiltroDeConsultas],
    ),
  );

  constructor() {
    const sessao = inject(SessaoService);
    const idDoUsuario = computed(() => sessao.usuario()?.id);
    effect(() => {
      idDoUsuario();
      untracked(() => this.limpar());
    });
  }

  atualizar(alteracoes: Partial<FiltroDeConsultas>): void {
    this.estado.update((filtro) => ({ ...filtro, ...alteracoes }));
  }

  limpar(): void {
    this.estado.set(FILTRO_VAZIO);
  }
}
