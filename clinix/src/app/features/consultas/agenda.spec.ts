import { StatusConsulta } from '../../core/modelos/consulta';
import { umaConsulta } from '../../testing/fabricas';
import { agruparPorDia, separarParaPaciente } from './agenda';

// Datas montadas no horário local: os testes valem em qualquer fuso.
const emLocal = (mes: number, dia: number, hora: number, minuto = 0) =>
  new Date(2026, mes - 1, dia, hora, minuto).toISOString();
const AGORA = new Date(2026, 8, 28, 9, 0); // segunda-feira, 28 de setembro de 2026

describe('agruparPorDia', () => {
  const consulta = (id: string, data: string) => umaConsulta({ id_consulta: id, data });

  it('agrupa por dia, em ordem cronológica, com os horários em ordem', () => {
    const dias = agruparPorDia(
      [
        consulta('tarde-30', emLocal(9, 30, 14)),
        consulta('manha-28', emLocal(9, 28, 10)),
        consulta('manha-30', emLocal(9, 30, 8, 30)),
      ],
      AGORA,
    );

    expect(dias.map((dia) => dia.consultas.map((c) => c.id_consulta))).toEqual([
      ['manha-28'],
      ['manha-30', 'tarde-30'],
    ]);
  });

  it('marca hoje e amanhã', () => {
    const dias = agruparPorDia(
      [
        consulta('a', emLocal(9, 28, 10)),
        consulta('b', emLocal(9, 29, 10)),
        consulta('c', emLocal(9, 30, 10)),
      ],
      AGORA,
    );

    expect(dias.map((dia) => dia.relativo)).toEqual(['Hoje', 'Amanhã', null]);
  });

  it('escreve o dia por extenso, com inicial maiúscula', () => {
    const [dia] = agruparPorDia([consulta('a', emLocal(9, 30, 10))], AGORA);

    expect(dia.rotulo).toBe('Quarta-feira, 30 de setembro');
  });

  it('inclui o ano quando o dia não é deste ano', () => {
    const [dia] = agruparPorDia([consulta('a', emLocal(13, 1, 10))], AGORA);

    expect(dia.rotulo).toBe('Sexta-feira, 1 de janeiro de 2027');
  });

  it('lista vazia não gera dias', () => {
    expect(agruparPorDia([], AGORA)).toEqual([]);
  });
});

describe('separarParaPaciente', () => {
  it('separa as consultas do paciente dos horários livres', () => {
    const minha = umaConsulta({
      id_consulta: 'minha',
      status: StatusConsulta.AGENDADA,
      id_paciente: 'p1',
    });
    const cancelada = umaConsulta({
      id_consulta: 'cancelada',
      status: StatusConsulta.CANCELADA,
      id_paciente: 'p1',
    });
    const livre = umaConsulta({ id_consulta: 'livre', status: StatusConsulta.DISPONIVEL });

    const { proprias, livres } = separarParaPaciente([livre, cancelada, minha], 'p1');

    expect(proprias.map((c) => c.id_consulta).sort()).toEqual(['cancelada', 'minha']);
    expect(livres.map((c) => c.id_consulta)).toEqual(['livre']);
  });

  it('as próprias vêm em ordem cronológica', () => {
    const depois = umaConsulta({
      id_consulta: 'depois',
      id_paciente: 'p1',
      status: StatusConsulta.AGENDADA,
      data: emLocal(10, 5, 9),
    });
    const antes = umaConsulta({
      id_consulta: 'antes',
      id_paciente: 'p1',
      status: StatusConsulta.AGENDADA,
      data: emLocal(10, 1, 9),
    });

    expect(separarParaPaciente([depois, antes], 'p1').proprias.map((c) => c.id_consulta)).toEqual([
      'antes',
      'depois',
    ]);
  });
});
