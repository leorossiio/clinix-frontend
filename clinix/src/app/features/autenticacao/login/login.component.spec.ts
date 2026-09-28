import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { tokenQueExpiraEm, umUsuario } from '../../../testing/tokens';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let servidor: HttpTestingController;
  let navegar: jasmine.Spy;

  function montar(queryParams: Record<string, string> = {}) {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } },
        },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    servidor = TestBed.inject(HttpTestingController);
    navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    fixture.detectChanges();
  }

  const tela = () => fixture.nativeElement as HTMLElement;
  function preencherEEnviar(email: string, senha: string) {
    const campo = (id: string) => tela().querySelector<HTMLInputElement>(`#${id}`)!;
    campo('email').value = email;
    campo('email').dispatchEvent(new Event('input'));
    campo('senha').value = senha;
    campo('senha').dispatchEvent(new Event('input'));
    tela().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
  const responderLogin = () =>
    servidor
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush({ token: tokenQueExpiraEm(3600), usuario: umUsuario() });

  afterEach(() => servidor.verify());

  it('entra e vai para as consultas', () => {
    montar();

    preencherEEnviar('ana@clinix.dev', 'segredo1');
    responderLogin();

    expect(navegar).toHaveBeenCalledWith('/consultas');
  });

  it('volta para a página que o usuário tentou abrir', () => {
    montar({ retorno: '/usuarios' });

    preencherEEnviar('ana@clinix.dev', 'segredo1');
    responderLogin();

    expect(navegar).toHaveBeenCalledWith('/usuarios');
  });

  it('ignora endereços de retorno externos (evita redirecionamento malicioso)', () => {
    montar({ retorno: '//site-malicioso.com' });

    preencherEEnviar('ana@clinix.dev', 'segredo1');
    responderLogin();

    expect(navegar).toHaveBeenCalledWith('/consultas');
  });

  it('mostra a mensagem da API quando as credenciais são recusadas', () => {
    montar();

    preencherEEnviar('ana@clinix.dev', 'errada');
    servidor
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush({ error: 'E-mail ou senha inválidos.' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    expect(tela().querySelector('[role="alert"]')?.textContent).toContain(
      'E-mail ou senha inválidos.',
    );
  });

  it('não envia o formulário com e-mail inválido', () => {
    montar();

    preencherEEnviar('nao-e-email', 'segredo1');

    servidor.expectNone(`${environment.apiUrl}/auth/login`);
    expect(tela().textContent).toContain('Informe um e-mail válido');
  });

  it('avisa quando a sessão anterior expirou', () => {
    montar({ sessao: 'expirada' });

    expect(tela().textContent).toContain('Sua sessão expirou');
  });
});
