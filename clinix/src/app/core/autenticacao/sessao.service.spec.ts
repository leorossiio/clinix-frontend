import { TestBed } from '@angular/core/testing';
import { TipoUsuario } from '../modelos/usuario';
import { tokenQueExpiraEm, umUsuario } from '../../testing/tokens';
import { SessaoService } from './sessao.service';

describe('SessaoService', () => {
  /** Simula recarregar a página: nova instância lendo o localStorage. */
  const novaInstancia = () => {
    TestBed.resetTestingModule();
    return TestBed.inject(SessaoService);
  };

  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it('começa sem sessão', () => {
    const sessao = novaInstancia();

    expect(sessao.estaAtiva()).toBeFalse();
    expect(sessao.usuario()).toBeNull();
  });

  it('após o login, expõe o usuário e o token', () => {
    const sessao = novaInstancia();
    const token = tokenQueExpiraEm(3600);

    sessao.iniciar(token, umUsuario({ nome: 'Ana' }));

    expect(sessao.estaAtiva()).toBeTrue();
    expect(sessao.usuario()?.nome).toBe('Ana');
    expect(sessao.token).toBe(token);
  });

  it('mantém a sessão ao recarregar a página', () => {
    novaInstancia().iniciar(tokenQueExpiraEm(3600), umUsuario({ nome: 'Ana' }));

    expect(novaInstancia().usuario()?.nome).toBe('Ana');
  });

  it('encerra sozinha quando o token expira', () => {
    const sessao = novaInstancia();
    sessao.iniciar(tokenQueExpiraEm(-1), umUsuario());

    expect(sessao.estaAtiva()).toBeFalse();
    expect(sessao.usuario()).toBeNull();
  });

  it('logout apaga a sessão salva', () => {
    novaInstancia().iniciar(tokenQueExpiraEm(3600), umUsuario());
    novaInstancia().encerrar();

    expect(novaInstancia().estaAtiva()).toBeFalse();
  });

  it('ignora dados corrompidos no armazenamento', () => {
    localStorage.setItem('clinix.sessao', '{corrompido');

    expect(novaInstancia().estaAtiva()).toBeFalse();
  });

  it('informa se o usuário tem um dos perfis', () => {
    const sessao = novaInstancia();
    sessao.iniciar(tokenQueExpiraEm(3600), umUsuario({ tipo_usuario: TipoUsuario.MEDICO }));

    expect(sessao.temPerfil(TipoUsuario.MEDICO, TipoUsuario.ADMIN)).toBeTrue();
    expect(sessao.temPerfil(TipoUsuario.ADMIN)).toBeFalse();
  });
});
