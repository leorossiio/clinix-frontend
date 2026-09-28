import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';
import { NovaConsulta } from '../../../../core/modelos/consulta';
import { TipoUsuario } from '../../../../core/modelos/usuario';
import { umUsuario } from '../../../../testing/tokens';
import { ModalNovaConsultaComponent } from './modal-nova-consulta.component';

describe('ModalNovaConsultaComponent', () => {
  let fixture: ComponentFixture<ModalNovaConsultaComponent>;
  let servidor: HttpTestingController;
  let salvo: NovaConsulta | undefined;

  function montar({ escolherMedico }: { escolherMedico: boolean }) {
    TestBed.configureTestingModule({
      imports: [ModalNovaConsultaComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servidor = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ModalNovaConsultaComponent);
    fixture.componentRef.setInput('escolherMedico', escolherMedico);
    salvo = undefined;
    fixture.componentInstance.salvar.subscribe((nova) => (salvo = nova));
    fixture.detectChanges();
  }

  const tela = () => fixture.nativeElement as HTMLElement;
  function preencher(id: string, valor: string, evento = 'input') {
    const campo = tela().querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;
    campo.value = valor;
    campo.dispatchEvent(new Event(evento));
  }
  function enviar() {
    tela().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  afterEach(() => servidor.verify());

  it('o médico abre horário na própria agenda, sem informar médico', () => {
    montar({ escolherMedico: false });

    preencher('data', '2026-11-05T09:30');
    preencher('descricao', ' Retorno ');
    enviar();

    expect(salvo).toEqual({
      data: new Date('2026-11-05T09:30').toISOString(),
      descricao: 'Retorno',
    });
  });

  it('o administrador escolhe o médico entre os ativos', () => {
    montar({ escolherMedico: true });
    const medico = umUsuario({
      id_usuario: 'm1',
      nome: 'Dra. Ana',
      tipo_usuario: TipoUsuario.MEDICO,
    });
    servidor.expectOne(`${environment.apiUrl}/usuarios/medicos`).flush([medico]);
    fixture.detectChanges();

    preencher('medico', 'm1', 'change');
    preencher('data', '2026-11-05T09:30');
    enviar();

    expect(salvo?.id_medico).toBe('m1');
  });

  it('o administrador precisa escolher um médico', () => {
    montar({ escolherMedico: true });
    servidor.expectOne(`${environment.apiUrl}/usuarios/medicos`).flush([]);

    preencher('data', '2026-11-05T09:30');
    enviar();

    expect(salvo).toBeUndefined();
    expect(tela().textContent).toContain('Selecione o médico');
  });

  it('exige a data', () => {
    montar({ escolherMedico: false });

    enviar();

    expect(salvo).toBeUndefined();
    expect(tela().textContent).toContain('Informe uma data futura');
  });
});
