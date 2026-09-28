import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { umaConsulta } from '../../testing/fabricas';
import { ConsultaService } from './consulta.service';

describe('ConsultaService', () => {
  const URL = `${environment.apiUrl}/consultas`;
  let service: ConsultaService;
  let servidor: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConsultaService);
    servidor = TestBed.inject(HttpTestingController);
  });

  afterEach(() => servidor.verify());

  it('lista as consultas visíveis para o usuário logado', () => {
    let recebidas: unknown;
    service.listar().subscribe((consultas) => (recebidas = consultas));

    servidor.expectOne({ method: 'GET', url: URL }).flush([umaConsulta()]);

    expect(recebidas).toEqual([umaConsulta()]);
  });

  it('abre um horário enviando data ISO e descrição', () => {
    const nova = { data: '2026-10-10T13:00:00.000Z', descricao: 'Rotina' };

    service.abrirHorario(nova).subscribe();

    expect(servidor.expectOne({ method: 'POST', url: URL }).request.body).toEqual(nova);
  });

  it('agenda sem enviar o paciente: a API o identifica pelo token', () => {
    service.agendar('c1').subscribe();

    const requisicao = servidor.expectOne({ method: 'PUT', url: `${URL}/c1/agendar` }).request;
    expect(requisicao.body).toBeNull();
  });

  it('cancela informando o motivo', () => {
    service.cancelar('c1', 'Viagem').subscribe();

    const requisicao = servidor.expectOne({ method: 'PUT', url: `${URL}/c1/cancelar` }).request;
    expect(requisicao.body).toEqual({ motivo_cancelamento: 'Viagem' });
  });

  it('reagenda, edita e remove nas rotas corretas', () => {
    service.reagendar('c1').subscribe();
    service.editar('c1', { descricao: 'Retorno' }).subscribe();
    service.remover('c1').subscribe();

    servidor.expectOne({ method: 'PUT', url: `${URL}/c1/reagendar` });
    expect(servidor.expectOne({ method: 'PUT', url: `${URL}/c1` }).request.body).toEqual({
      descricao: 'Retorno',
    });
    servidor.expectOne({ method: 'DELETE', url: `${URL}/c1` });
  });
});
