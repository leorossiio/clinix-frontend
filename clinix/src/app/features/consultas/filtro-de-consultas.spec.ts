import { StatusConsulta } from '../../core/modelos/consulta';
import { umaConsulta } from '../../testing/fabricas';
import { FILTRO_VAZIO, filtrarConsultas } from './filtro-de-consultas';

describe('filtrarConsultas', () => {
  const helena = umaConsulta({
    id_consulta: 'helena',
    descricao: 'Check-up cardiológico',
    medico: { id_usuario: 'm1', nome: 'Dra. Helena Prado', especialidade: 0 },
  });
  const joao = umaConsulta({
    id_consulta: 'joao',
    descricao: 'Vacinação',
    status: StatusConsulta.AGENDADA,
    data: '2026-10-20T13:00:00.000Z',
    medico: { id_usuario: 'm2', nome: 'Dr. João Araújo', especialidade: 1 },
  });
  const todas = [helena, joao];
  const ids = (filtro: Partial<typeof FILTRO_VAZIO>) =>
    filtrarConsultas(todas, { ...FILTRO_VAZIO, ...filtro }).map((c) => c.id_consulta);

  it('sem filtros, mostra tudo', () => {
    expect(ids({})).toEqual(['helena', 'joao']);
  });

  it('busca pelo nome do médico ignorando maiúsculas e acentos', () => {
    expect(ids({ medico: 'joao araujo' })).toEqual(['joao']);
  });

  it('busca pela descrição', () => {
    expect(ids({ descricao: 'CARDIO' })).toEqual(['helena']);
  });

  it('filtra por especialidade e por status', () => {
    expect(ids({ especialidade: 1 })).toEqual(['joao']);
    expect(ids({ status: StatusConsulta.DISPONIVEL })).toEqual(['helena']);
  });

  it('o filtro de período inclui o dia inteiro das duas pontas', () => {
    const noDia20 = new Date('2026-10-20T13:00:00.000Z');
    const dia = `${noDia20.getFullYear()}-${String(noDia20.getMonth() + 1).padStart(2, '0')}-${String(noDia20.getDate()).padStart(2, '0')}`;

    expect(ids({ dataInicio: dia, dataFim: dia })).toEqual(['joao']);
  });

  it('combina os critérios', () => {
    expect(ids({ medico: 'helena', status: StatusConsulta.AGENDADA })).toEqual([]);
  });
});
