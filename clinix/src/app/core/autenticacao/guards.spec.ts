import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { TipoUsuario } from '../modelos/usuario';
import { tokenQueExpiraEm, umUsuario } from '../../testing/tokens';
import { autenticadoGuard, perfilGuard, visitanteGuard } from './guards';
import { SessaoService } from './sessao.service';

describe('guards de rota', () => {
  const executar = (guard: CanActivateFn, url = '/consultas') =>
    TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );
  const urlDe = (resultado: unknown) => TestBed.inject(Router).serializeUrl(resultado as UrlTree);
  const entrarComo = (tipo: TipoUsuario) =>
    TestBed.inject(SessaoService).iniciar(
      tokenQueExpiraEm(3600),
      umUsuario({ tipo_usuario: tipo }),
    );

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  describe('autenticadoGuard', () => {
    it('manda para o login lembrando a página pedida', () => {
      expect(urlDe(executar(autenticadoGuard, '/usuarios'))).toBe('/login?retorno=%2Fusuarios');
    });

    it('libera quem está logado', () => {
      entrarComo(TipoUsuario.PACIENTE);

      expect(executar(autenticadoGuard)).toBeTrue();
    });
  });

  describe('perfilGuard', () => {
    it('mostra acesso negado para perfis não permitidos', () => {
      entrarComo(TipoUsuario.PACIENTE);

      expect(urlDe(executar(perfilGuard(TipoUsuario.ADMIN)))).toBe('/403');
    });

    it('libera perfis permitidos', () => {
      entrarComo(TipoUsuario.ADMIN);

      expect(executar(perfilGuard(TipoUsuario.ADMIN))).toBeTrue();
    });
  });

  describe('visitanteGuard', () => {
    it('quem já está logado vai direto para as consultas', () => {
      entrarComo(TipoUsuario.PACIENTE);

      expect(urlDe(executar(visitanteGuard, '/login'))).toBe('/consultas');
    });

    it('visitantes veem a página normalmente', () => {
      expect(executar(visitanteGuard, '/login')).toBeTrue();
    });
  });
});
