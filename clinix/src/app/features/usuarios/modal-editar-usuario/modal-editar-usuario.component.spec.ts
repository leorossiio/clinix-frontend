import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtualizacaoDeUsuario } from '../../../core/modelos/usuario';
import { umUsuario } from '../../../testing/tokens';
import { ModalEditarUsuarioComponent } from './modal-editar-usuario.component';

describe('ModalEditarUsuarioComponent', () => {
  let fixture: ComponentFixture<ModalEditarUsuarioComponent>;
  let salvo: AtualizacaoDeUsuario | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ModalEditarUsuarioComponent] });
    fixture = TestBed.createComponent(ModalEditarUsuarioComponent);
    fixture.componentRef.setInput('usuario', umUsuario({ nome: 'Paula', email: 'paula@x.com' }));
    salvo = undefined;
    fixture.componentInstance.salvar.subscribe((alteracoes) => (salvo = alteracoes));
    fixture.detectChanges();
  });

  const tela = () => fixture.nativeElement as HTMLElement;
  function digitar(id: string, valor: string) {
    const campo = tela().querySelector<HTMLInputElement>(`#${id}`)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
  }
  function enviar() {
    tela().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('envia apenas os campos alterados', () => {
    digitar('nome', 'Paula Souza');
    enviar();

    expect(salvo).toEqual({ nome: 'Paula Souza' });
  });

  it('só troca a senha quando uma nova é digitada', () => {
    digitar('senha', 'nova-senha');
    enviar();

    expect(salvo).toEqual({ senha: 'nova-senha' });
  });

  it('recusa senha curta', () => {
    digitar('senha', '123');
    enviar();

    expect(salvo).toBeUndefined();
    expect(tela().textContent).toContain('entre 6 e 72 caracteres');
  });
});
