import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tokenQueExpiraEm, umUsuario } from '../../testing/tokens';
import { autenticacaoInterceptor } from './autenticacao.interceptor';
import { SessaoService } from './sessao.service';

describe('autenticacaoInterceptor', () => {
  const API = environment.apiUrl;
  const token = tokenQueExpiraEm(3600);
  let http: HttpClient;
  let servidor: HttpTestingController;
  let sessao: SessaoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([autenticacaoInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    servidor = TestBed.inject(HttpTestingController);
    sessao = TestBed.inject(SessaoService);
  });

  afterEach(() => servidor.verify());

  it('envia o token nas chamadas para a API', () => {
    sessao.iniciar(token, umUsuario());

    http.get(`${API}/consultas`).subscribe();

    const requisicao = servidor.expectOne(`${API}/consultas`).request;
    expect(requisicao.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('não vaza o token para outros domínios', () => {
    sessao.iniciar(token, umUsuario());

    http.get('https://outro-site.com/dados').subscribe();

    const requisicao = servidor.expectOne('https://outro-site.com/dados').request;
    expect(requisicao.headers.has('Authorization')).toBeFalse();
  });

  it('quando a API recusa a sessão (401), faz logout e volta ao login', () => {
    sessao.iniciar(token, umUsuario());
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);

    http.get(`${API}/consultas`).subscribe({ error: () => undefined });
    servidor
      .expectOne(`${API}/consultas`)
      .flush({ error: 'Sessão expirada' }, { status: 401, statusText: 'Unauthorized' });

    expect(sessao.estaAtiva()).toBeFalse();
    expect(navegar).toHaveBeenCalledWith(['/login'], { queryParams: { sessao: 'expirada' } });
  });

  it('senha errada no login (401) não é tratada como sessão expirada', () => {
    const navegar = spyOn(TestBed.inject(Router), 'navigate');

    http.post(`${API}/auth/login`, {}).subscribe({ error: () => undefined });
    servidor.expectOne(`${API}/auth/login`).flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(navegar).not.toHaveBeenCalled();
  });
});
