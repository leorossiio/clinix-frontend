import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { umaConsulta } from '../../../../testing/fabricas';
import { ModalCancelarConsultaComponent } from './modal-cancelar-consulta.component';

registerLocaleData(localePt);

describe('ModalCancelarConsultaComponent', () => {
  let fixture: ComponentFixture<ModalCancelarConsultaComponent>;
  let confirmado: string | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalCancelarConsultaComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    });
    fixture = TestBed.createComponent(ModalCancelarConsultaComponent);
    fixture.componentRef.setInput('consulta', umaConsulta());
    confirmado = undefined;
    fixture.componentInstance.confirmar.subscribe((motivo) => (confirmado = motivo));
    fixture.detectChanges();
  });

  const tela = () => fixture.nativeElement as HTMLElement;
  function enviarMotivo(motivo: string) {
    const campo = tela().querySelector('textarea')!;
    campo.value = motivo;
    campo.dispatchEvent(new Event('input'));
    tela().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('confirma com o motivo informado, sem espaços nas pontas', () => {
    enviarMotivo('  Viagem a trabalho  ');

    expect(confirmado).toBe('Viagem a trabalho');
  });

  it('exige um motivo', () => {
    enviarMotivo('   ');

    expect(confirmado).toBeUndefined();
    expect(tela().textContent).toContain('Informe o motivo');
  });
});
