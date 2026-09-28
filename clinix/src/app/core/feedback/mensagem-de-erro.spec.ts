import { HttpErrorResponse } from '@angular/common/http';
import { mensagemDeErro } from './mensagem-de-erro';

describe('mensagemDeErro', () => {
  it('usa a mensagem enviada pela API', () => {
    const erro = new HttpErrorResponse({ status: 422, error: { error: 'Prazo expirado.' } });

    expect(mensagemDeErro(erro)).toBe('Prazo expirado.');
  });

  it('explica quando não há conexão com o servidor', () => {
    expect(mensagemDeErro(new HttpErrorResponse({ status: 0 }))).toContain('conexão');
  });

  it('usa a mensagem padrão quando a API não explica o erro', () => {
    const erro = new HttpErrorResponse({ status: 500, error: '<html>' });

    expect(mensagemDeErro(erro, 'Falhou.')).toBe('Falhou.');
  });

  it('usa a mensagem padrão para erros que não são HTTP', () => {
    expect(mensagemDeErro(new Error('x'), 'Falhou.')).toBe('Falhou.');
  });
});
