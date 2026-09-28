import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { TipoUsuario } from '../../../core/modelos/usuario';
import { tokenQueExpiraEm, umUsuario } from '../../../testing/tokens';
import { ListaUsuariosComponent } from './lista-usuarios.component';

describe('ListaUsuariosComponent', () => {
  const URL = `${environment.apiUrl}/usuarios`;
  const admin = umUsuario({ id_usuario: 'admin', nome: 'Admin', tipo_usuario: TipoUsuario.ADMIN });
  const paula = umUsuario({ id_usuario: 'paula', nome: 'Paula Paciente', email: 'paula@x.com' });
  const bruno = umUsuario({
    id_usuario: 'bruno',
    nome: 'Dr. Bruno',
    email: 'bruno@x.com',
    tipo_usuario: TipoUsuario.MEDICO,
    especialidade: 3,
  });
  let fixture: ComponentFixture<ListaUsuariosComponent>;
  let servidor: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ListaUsuariosComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.inject(SessaoService).iniciar(tokenQueExpiraEm(3600), admin);
    servidor = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    responderLista();
  });

  afterEach(() => servidor.verify());

  const tela = () => fixture.nativeElement as HTMLElement;
  const linhas = () => [...tela().querySelectorAll('tbody tr')].map((tr) => tr.textContent ?? '');
  function responderLista(usuarios = [admin, paula, bruno]) {
    servidor.expectOne({ method: 'GET', url: URL }).flush(usuarios);
    fixture.detectChanges();
  }

  it('lista os usuários com perfil e especialidade', () => {
    expect(linhas().length).toBe(3);
    expect(linhas().find((l) => l.includes('Dr. Bruno'))).toContain('Dermatologia');
  });

  it('a busca filtra por nome, e-mail ou perfil', () => {
    const busca = tela().querySelector<HTMLInputElement>('input[type="search"]')!;
    busca.value = 'médico';
    busca.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(linhas().length).toBe(1);
    expect(linhas()[0]).toContain('Dr. Bruno');
  });

  it('não oferece excluir a própria conta', () => {
    const linhaDoAdmin = [...tela().querySelectorAll('tbody tr')].find((tr) =>
      tr.textContent?.includes('Admin'),
    )!;

    expect(linhaDoAdmin.querySelector('[aria-label^="Excluir"]')).toBeNull();
  });

  it('exclui um usuário após confirmação e recarrega a lista', () => {
    spyOn(TestBed.inject(FeedbackService), 'confirmar').and.returnValue(true);

    tela().querySelector<HTMLButtonElement>('[aria-label="Excluir Paula Paciente"]')!.click();
    servidor.expectOne({ method: 'DELETE', url: `${URL}/paula` }).flush(null);
    responderLista([admin, bruno]);

    expect(linhas().some((l) => l.includes('Paula'))).toBeFalse();
  });
});
