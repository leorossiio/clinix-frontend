import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { tokenQueExpiraEm, umUsuario } from '../../testing/tokens';
import { AutenticacaoService } from './autenticacao.service';
import { SessaoService } from './sessao.service';

describe('AutenticacaoService', () => {
  let servidor: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servidor = TestBed.inject(HttpTestingController);
  });

  afterEach(() => servidor.verify());

  it('ao entrar, inicia a sessão com o usuário devolvido pela API', () => {
    TestBed.inject(AutenticacaoService).entrar('ana@clinix.dev', 'segredo').subscribe();

    const requisicao = servidor.expectOne(`${environment.apiUrl}/auth/login`);
    expect(requisicao.request.body).toEqual({ email: 'ana@clinix.dev', senha: 'segredo' });
    requisicao.flush({ token: tokenQueExpiraEm(3600), usuario: umUsuario({ nome: 'Ana' }) });

    expect(TestBed.inject(SessaoService).usuario()?.nome).toBe('Ana');
  });

  it('ao sair, encerra a sessão', () => {
    const sessao = TestBed.inject(SessaoService);
    sessao.iniciar(tokenQueExpiraEm(3600), umUsuario());

    TestBed.inject(AutenticacaoService).sair();

    expect(sessao.estaAtiva()).toBeFalse();
  });
});
