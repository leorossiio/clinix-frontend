import { Injectable, computed, signal } from '@angular/core';
import { TipoUsuario, Usuario } from '../modelos/usuario';
import { lerPayloadDoToken } from './jwt';

export interface UsuarioDaSessao {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

interface Sessao {
  token: string;
  usuario: UsuarioDaSessao;
}

const CHAVE = 'clinix.sessao';
/** Chaves gravadas pela versão anterior; removidas para não deixar lixo no navegador. */
const CHAVES_LEGADAS = ['token', 'tipo'];

/**
 * Fonte única da sessão do usuário logado (antes o token era decodificado em
 * quatro lugares diferentes). Persiste no localStorage para sobreviver a um
 * recarregamento da página e encerra sozinha quando o token expira.
 */
@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly sessao = signal<Sessao | null>(this.restaurar());

  readonly usuario = computed(() => this.sessao()?.usuario ?? null);

  get token(): string | null {
    return this.estaAtiva() ? this.sessao()!.token : null;
  }

  iniciar(token: string, usuario: Usuario): void {
    const sessao: Sessao = {
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario,
      },
    };
    this.sessao.set(sessao);
    this.gravar(sessao);
  }

  encerrar(): void {
    this.sessao.set(null);
    this.gravar(null);
  }

  /** Verifica também a expiração: um token vencido encerra a sessão na hora. */
  estaAtiva(): boolean {
    const sessao = this.sessao();
    if (!sessao) return false;
    if (expirou(sessao.token)) {
      this.encerrar();
      return false;
    }
    return true;
  }

  temPerfil(...tipos: TipoUsuario[]): boolean {
    return this.estaAtiva() && tipos.includes(this.usuario()!.tipo);
  }

  private restaurar(): Sessao | null {
    try {
      CHAVES_LEGADAS.forEach((chave) => localStorage.removeItem(chave));
      const salvo = localStorage.getItem(CHAVE);
      return salvo ? (JSON.parse(salvo) as Sessao) : null;
    } catch {
      return null;
    }
  }

  private gravar(sessao: Sessao | null): void {
    try {
      if (sessao) localStorage.setItem(CHAVE, JSON.stringify(sessao));
      else localStorage.removeItem(CHAVE);
    } catch {
      // Navegação privada pode bloquear o storage; a sessão segue só em memória.
    }
  }
}

function expirou(token: string): boolean {
  const exp = lerPayloadDoToken(token)?.exp;
  return exp === undefined || exp * 1000 <= Date.now();
}
