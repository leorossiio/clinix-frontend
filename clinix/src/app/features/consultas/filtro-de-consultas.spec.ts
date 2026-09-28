import { StatusConsulta } from '../../core/modelos/consulta';
import { umaConsulta } from '../../testing/fabricas';
import { FILTRO_VAZIO, filtrarConsultas } from './filtro-de-consultas';

describe('filtrarConsultas', () => {
  const helena = umaConsulta({
    id_consulta: 'helena',
    descricao: 'Check-up anual',
    medico: { id_usuario: 'm1', nome: 'Dra. Helena Prado', especialidade: 0 },
  });
  const joao = umaConsulta({
    id_consulta: 'joao',
    descricao: 'Vacinação',
    status: StatusConsulta.AGENDADA,
    data: '2026-10-20T13:00:00.000Z',
    medico: { id_usuario: 'm2', nome: 'Dr. João Araújo', especialidade: 1 },
    paciente: { id_usuario: 'p1', nome: 'Carla Mendes' },
  });
  const todas = [helena, joao];
  const ids = (filtro: Partial<typeof FILTRO_VAZIO>) =>
    filtrarConsultas(todas, { ...FILTRO_VAZIO, ...filtro }).map((c) => c.id_consulta);

  it('sem filtros, mostra tudo', () => {
    expect(ids({})).toEqual(['helena', 'joao']);
  });

  describe('busca', () => {
    it('encontra pelo nome do médico, ignorando maiúsculas e acentos', () => {
      expect(ids({ busca: 'joao araujo' })).toEqual(['joao']);
    });

    it('encontra pela descrição', () => {
      expect(ids({ busca: 'CHECK-UP' })).toEqual(['helena']);
    });

    it('encontra pelo nome do paciente (agenda da clínica)', () => {
      expect(ids({ busca: 'carla' })).toEqual(['joao']);
    });

    it('encontra pelo nome da especialidade', () => {
      expect(ids({ busca: 'pediatria' })).toEqual(['joao']);
    });
  });

  it('filtra por especialidade e por situação', () => {
    expect(ids({ especialidade: 1 })).toEqual(['joao']);
    expect(ids({ status: StatusConsulta.DISPONIVEL })).toEqual(['helena']);
  });

  it('o filtro de período inclui o dia inteiro das duas pontas', () => {
    const noDia20 = new Date('2026-10-20T13:00:00.000Z');
    const dia = [
      noDia20.getFullYear(),
      String(noDia20.getMonth() + 1).padStart(2, '0'),
      String(noDia20.getDate()).padStart(2, '0'),
    ].join('-');

    expect(ids({ dataInicio: dia, dataFim: dia })).toEqual(['joao']);
  });

  it('combina os critérios', () => {
    expect(ids({ busca: 'helena', status: StatusConsulta.AGENDADA })).toEqual([]);
  });
});
