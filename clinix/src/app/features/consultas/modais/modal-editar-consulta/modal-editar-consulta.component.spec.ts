import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdicaoDeConsulta } from '../../../../core/modelos/consulta';
import { paraDatetimeLocal } from '../../../../shared/utils/datas';
import { umaConsulta } from '../../../../testing/fabricas';
import { ModalEditarConsultaComponent } from './modal-editar-consulta.component';

describe('ModalEditarConsultaComponent', () => {
  let fixture: ComponentFixture<ModalEditarConsultaComponent>;
  let salvo: EdicaoDeConsulta | undefined;
  let fechou: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ModalEditarConsultaComponent] });
    fixture = TestBed.createComponent(ModalEditarConsultaComponent);
    fixture.componentRef.setInput(
      'consulta',
      umaConsulta({ data: '2026-10-10T13:00:00.000Z', descricao: 'Rotina' }),
    );
    salvo = undefined;
    fechou = false;
    fixture.componentInstance.salvar.subscribe((alteracoes) => (salvo = alteracoes));
    fixture.componentInstance.fechar.subscribe(() => (fechou = true));
    fixture.detectChanges();
  });

  const campo = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(`#${id}`)!;
  const digitar = (id: string, valor: string) => {
    campo(id).value = valor;
    campo(id).dispatchEvent(new Event('input'));
  };
  const enviar = () =>
    (fixture.nativeElement as HTMLElement)
      .querySelector('form')!
      .dispatchEvent(new Event('submit'));

  it('abre com a data e a descrição atuais', () => {
    expect(campo('data').value).toBe(paraDatetimeLocal('2026-10-10T13:00:00.000Z'));
    expect(campo('descricao').value).toBe('Rotina');
  });

  it('envia só a descrição quando só ela mudou (não reenvia a data)', () => {
    digitar('descricao', 'Retorno');
    enviar();

    expect(salvo).toEqual({ descricao: 'Retorno' });
  });

  it('envia a nova data como instante ISO', () => {
    digitar('data', '2026-11-05T09:30');
    enviar();

    expect(salvo).toEqual({ data: new Date('2026-11-05T09:30').toISOString() });
  });

  it('sem alterações, apenas fecha', () => {
    enviar();

    expect(salvo).toBeUndefined();
    expect(fechou).toBeTrue();
  });
});
