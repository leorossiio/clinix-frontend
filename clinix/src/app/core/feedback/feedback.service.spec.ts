import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  let feedback: FeedbackService;

  beforeEach(() => (feedback = TestBed.inject(FeedbackService)));

  it('exibe mensagens de sucesso', () => {
    feedback.sucesso('Consulta agendada.');

    expect(feedback.mensagens()).toEqual([
      jasmine.objectContaining({ tipo: 'sucesso', texto: 'Consulta agendada.' }),
    ]);
  });

  it('exibe a mensagem de erro enviada pela API', () => {
    feedback.erro(new HttpErrorResponse({ status: 422, error: { error: 'Horário ocupado.' } }));

    expect(feedback.mensagens()[0]).toEqual(
      jasmine.objectContaining({ tipo: 'erro', texto: 'Horário ocupado.' }),
    );
  });

  it('as mensagens somem sozinhas depois de alguns segundos', fakeAsync(() => {
    feedback.sucesso('Pronto.');

    tick(5000);

    expect(feedback.mensagens()).toEqual([]);
  }));

  it('o usuário pode fechar uma mensagem', () => {
    feedback.sucesso('Pronto.');

    feedback.fechar(feedback.mensagens()[0].id);

    expect(feedback.mensagens()).toEqual([]);
  });
});
