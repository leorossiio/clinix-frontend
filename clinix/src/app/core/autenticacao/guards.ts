import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TipoUsuario } from '../modelos/usuario';
import { SessaoService } from './sessao.service';

/**
 * Guards controlam só a NAVEGAÇÃO. A segurança de verdade está no backend,
 * que confere token e permissões em toda requisição.
 */

/** Exige login; guarda a página pedida para voltar a ela depois de entrar. */
export const autenticadoGuard: CanActivateFn = (_rota, estado) => {
  if (inject(SessaoService).estaAtiva()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { retorno: estado.url } });
};

/** Exige um dos perfis. Use depois de `autenticadoGuard`. */
export const perfilGuard =
  (...tipos: TipoUsuario[]): CanActivateFn =>
  () =>
    inject(SessaoService).temPerfil(...tipos) || inject(Router).createUrlTree(['/403']);

/** Páginas de visitante (login, cadastro): quem já está logado vai para as consultas. */
export const visitanteGuard: CanActivateFn = () =>
  !inject(SessaoService).estaAtiva() || inject(Router).createUrlTree(['/consultas']);
