import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { TipoUsuario } from '../../../core/modelos/usuario';
import { tokenQueExpiraEm, umUsuario } from '../../../testing/tokens';
import { CabecalhoComponent } from './cabecalho.component';

describe('CabecalhoComponent', () => {
  let fixture: ComponentFixture<CabecalhoComponent>;

  function montarComo(tipo: TipoUsuario) {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CabecalhoComponent],
      providers: [provideRouter([]), provideHttpClient()],
    });
    TestBed.inject(SessaoService).iniciar(
      tokenQueExpiraEm(3600),
      umUsuario({ nome: 'Paula Souza', tipo_usuario: tipo }),
    );
    fixture = TestBed.createComponent(CabecalhoComponent);
    fixture.detectChanges();
  }

  const tela = () => fixture.nativeElement as HTMLElement;

  it('cumprimenta pelo primeiro nome e mostra o perfil', () => {
    montarComo(TipoUsuario.PACIENTE);

    expect(tela().textContent).toContain('Paula');
    expect(tela().textContent).toContain('Paciente');
    expect(tela().textContent).not.toContain('Souza');
  });

  it('só o administrador vê o link de usuários', () => {
    montarComo(TipoUsuario.PACIENTE);
    expect(tela().textContent).not.toContain('Usuários');

    TestBed.resetTestingModule();
    montarComo(TipoUsuario.ADMIN);
    expect(tela().textContent).toContain('Usuários');
  });

  it('sair encerra a sessão e volta ao login', () => {
    montarComo(TipoUsuario.PACIENTE);
    const navegar = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);

    [...tela().querySelectorAll('button')].find((b) => b.textContent?.includes('Sair'))!.click();

    expect(TestBed.inject(SessaoService).estaAtiva()).toBeFalse();
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });
});
