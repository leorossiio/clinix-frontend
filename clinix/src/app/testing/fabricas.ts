import { Consulta, StatusConsulta } from '../core/modelos/consulta';

/** Consulta de teste com valores padrão; sobrescreva só o que importa para o cenário. */
export function umaConsulta(dados: Partial<Consulta> = {}): Consulta {
  return {
    id_consulta: 'c1',
    id_medico: 'medico-1',
    id_paciente: null,
    data: '2026-10-10T13:00:00.000Z',
    descricao: 'Rotina',
    status: StatusConsulta.DISPONIVEL,
    motivo_cancelamento: null,
    data_cancelamento: null,
    reagendavel: false,
    medico: { id_usuario: 'medico-1', nome: 'Dra. Helena Prado', especialidade: 0 },
    paciente: null,
    ...dados,
  };
}
