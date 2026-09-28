import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { umUsuario } from '../../../testing/tokens';
import { CadastroPacienteComponent } from './cadastro-paciente.component';

describe('CadastroPacienteComponent', () => {
  const URL = `${environment.apiUrl}/usuarios`;
  let fixture: ComponentFixture<CadastroPacienteComponent>;
  let servidor: HttpTestingController;
  let navegar: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CadastroPacienteComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    servidor = TestBed.inject(HttpTestingController);
    navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(CadastroPacienteComponent);
    fixture.detectChanges();
  });

  afterEach(() => servidor.verify());

  const tela = () => fixture.nativeElement as HTMLElement;
  function preencher(dados: Record<string, string>) {
    for (const [id, valor] of Object.entries(dados)) {
      const campo = tela().querySelector<HTMLInputElement>(`#${id}`)!;
      campo.value = valor;
      campo.dispatchEvent(new Event('input'));
      campo.dispatchEvent(new Event('blur'));
    }
    tela().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
  const valido = { nome: 'Carla', email: 'carla@x.com', senha: 'segura1', confirmacao: 'segura1' };

  it('cadastra, avisa e leva ao login', () => {
    preencher(valido);

    const requisicao = servidor.expectOne({ method: 'POST', url: URL });
    expect(requisicao.request.body).toEqual({
      nome: 'Carla',
      email: 'carla@x.com',
      senha: 'segura1',
    });
    requisicao.flush(umUsuario());

    expect(TestBed.inject(FeedbackService).mensagens()[0].texto).toContain('Cadastro realizado');
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });

  it('mostra o motivo quando a API recusa (ex.: e-mail em uso)', () => {
    preencher(valido);
    servidor
      .expectOne(URL)
      .flush(
        { error: 'Já existe um usuário ativo com este e-mail.' },
        { status: 409, statusText: '' },
      );
    fixture.detectChanges();

    expect(tela().querySelector('[role="alert"]')?.textContent).toContain('e-mail');
  });

  it('não envia com senhas diferentes', () => {
    preencher({ ...valido, confirmacao: 'outra-senha' });

    servidor.expectNone(URL);
    expect(tela().textContent).toContain('As senhas não coincidem');
  });
});
