import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { environment } from '../../../../environments/environment';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { StatusConsulta } from '../../../core/modelos/consulta';
import { TipoUsuario } from '../../../core/modelos/usuario';
import { umaConsulta } from '../../../testing/fabricas';
import { tokenQueExpiraEm, umUsuario } from '../../../testing/tokens';
import { FiltrosDeConsultasStore } from '../filtros-de-consultas.store';
import { PaginaConsultasComponent } from './pagina-consultas.component';

registerLocaleData(localePt);

describe('PaginaConsultasComponent', () => {
  const URL = `${environment.apiUrl}/consultas`;
  const futuro = new Date(Date.now() + 3 * 86_400_000).toISOString();
  let fixture: ComponentFixture<PaginaConsultasComponent>;
  let servidor: HttpTestingController;

  function montarComo(tipo: TipoUsuario) {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [PaginaConsultasComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    });
    TestBed.inject(SessaoService).iniciar(
      tokenQueExpiraEm(3600),
      umUsuario({ id_usuario: 'p1', tipo_usuario: tipo }),
    );
    servidor = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PaginaConsultasComponent);
    fixture.detectChanges();
  }

  const tela = () => fixture.nativeElement as HTMLElement;
  const botoes = (texto: string) =>
    [...tela().querySelectorAll('button')].filter((b) => b.textContent?.trim() === texto);
  function responderLista(consultas = [umaConsulta({ data: futuro })]) {
    servidor.expectOne({ method: 'GET', url: URL }).flush(consultas);
    fixture.detectChanges();
  }

  afterEach(() => servidor.verify());

  it('mostra um indicador de carregamento enquanto busca as consultas (CLINIXSM-41)', () => {
    montarComo(TipoUsuario.PACIENTE);

    expect(tela().querySelector('.carregando')).not.toBeNull();
    responderLista();
    expect(tela().querySelector('.carregando')).toBeNull();
  });

  it('o paciente agenda um horário e a lista é atualizada', () => {
    montarComo(TipoUsuario.PACIENTE);
    spyOn(TestBed.inject(FeedbackService), 'confirmar').and.returnValue(true);
    responderLista();

    botoes('Agendar')[0].click();
    servidor.expectOne({ method: 'PUT', url: `${URL}/c1/agendar` }).flush(umaConsulta());

    responderLista([
      umaConsulta({ data: futuro, status: StatusConsulta.AGENDADA, id_paciente: 'p1' }),
    ]);
    expect(botoes('Agendar').length).toBe(0);
    expect(botoes('Cancelar').length).toBe(1);
  });

  it('não agenda se o paciente desistir na confirmação', () => {
    montarComo(TipoUsuario.PACIENTE);
    spyOn(TestBed.inject(FeedbackService), 'confirmar').and.returnValue(false);
    responderLista();

    botoes('Agendar')[0].click();
    fixture.detectChanges();

    servidor.expectNone(`${URL}/c1/agendar`);
    expect(botoes('Agendar').length).toBe(1);
  });

  it('mostra o erro da API quando a ação falha', () => {
    montarComo(TipoUsuario.PACIENTE);
    spyOn(TestBed.inject(FeedbackService), 'confirmar').and.returnValue(true);
    responderLista();

    botoes('Agendar')[0].click();
    servidor
      .expectOne(`${URL}/c1/agendar`)
      .flush({ error: 'Este horário não está mais disponível.' }, { status: 422, statusText: '' });

    expect(TestBed.inject(FeedbackService).mensagens()[0].texto).toBe(
      'Este horário não está mais disponível.',
    );
    responderLista();
  });

  it('só médicos e administradores veem o botão de novo horário', () => {
    montarComo(TipoUsuario.PACIENTE);
    responderLista();
    expect(tela().textContent).not.toContain('Novo horário');

    TestBed.resetTestingModule();
    montarComo(TipoUsuario.MEDICO);
    responderLista();
    expect(tela().textContent).toContain('Novo horário');
  });

  it('não quebra se a sessão for encerrada com a página aberta (ex.: ao clicar em Sair)', () => {
    montarComo(TipoUsuario.PACIENTE);
    responderLista();

    TestBed.inject(SessaoService).encerrar();

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('os filtros continuam aplicados ao voltar para a página (CLINIXSM-43)', () => {
    montarComo(TipoUsuario.PACIENTE);
    TestBed.inject(FiltrosDeConsultasStore).atualizar({ medico: 'inexistente' });
    responderLista();

    fixture.destroy();
    fixture = TestBed.createComponent(PaginaConsultasComponent);
    fixture.detectChanges();
    responderLista();

    expect(tela().textContent).toContain('Nenhuma consulta corresponde aos filtros');
  });
});
