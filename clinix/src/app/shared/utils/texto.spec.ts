import { iniciais, normalizarParaBusca, primeiroNome } from './texto';

describe('texto', () => {
  it('normaliza para busca: minúsculas, sem acentos e sem espaços nas pontas', () => {
    expect(normalizarParaBusca('  João Araújo ')).toBe('joao araujo');
  });

  it('iniciais usam o primeiro e o último nome', () => {
    expect(iniciais('Paula Maria Souza')).toBe('PS');
  });

  it('iniciais de um nome único têm uma letra', () => {
    expect(iniciais('admin')).toBe('A');
  });

  it('iniciais ignoram pronomes de tratamento', () => {
    expect(iniciais('Dra. Helena Prado')).toBe('HP');
  });

  it('primeiro nome ignora pronomes de tratamento', () => {
    expect(primeiroNome('Dr. Rafael Lima')).toBe('Rafael');
    expect(primeiroNome('Paula Souza')).toBe('Paula');
  });

  it('iniciais de nome vazio são vazias', () => {
    expect(iniciais('   ')).toBe('');
  });
});
