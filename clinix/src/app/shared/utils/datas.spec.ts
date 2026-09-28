import { fimDoDia, inicioDoDia, paraDatetimeLocal, paraInstanteIso } from './datas';

describe('datas', () => {
  it('converte o valor de um input datetime-local em instante ISO UTC', () => {
    expect(paraInstanteIso('2026-10-01T14:30')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/);
  });

  it('ida e volta entre input e API preserva o horário digitado, em qualquer fuso', () => {
    expect(paraDatetimeLocal(paraInstanteIso('2026-10-01T14:30'))).toBe('2026-10-01T14:30');
  });

  it('formata datas no padrão aceito pelo datetime-local', () => {
    expect(paraDatetimeLocal(new Date(2026, 0, 5, 9, 7))).toBe('2026-01-05T09:07');
  });

  it('delimita o dia inteiro (horário local) para filtros por data', () => {
    expect(inicioDoDia('2026-10-01')).toEqual(new Date(2026, 9, 1, 0, 0, 0, 0));
    expect(fimDoDia('2026-10-01')).toEqual(new Date(2026, 9, 1, 23, 59, 59, 999));
  });
});
