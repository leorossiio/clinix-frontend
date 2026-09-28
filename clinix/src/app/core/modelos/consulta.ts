export const StatusConsulta = { DISPONIVEL: 0, AGENDADA: 1, CONCLUIDA: 2, CANCELADA: 3 } as const;
export type StatusConsulta = (typeof StatusConsulta)[keyof typeof StatusConsulta];

export const ROTULO_DO_STATUS: Record<StatusConsulta, string> = {
  [StatusConsulta.DISPONIVEL]: 'Disponível',
  [StatusConsulta.AGENDADA]: 'Agendada',
  [StatusConsulta.CONCLUIDA]: 'Concluída',
  [StatusConsulta.CANCELADA]: 'Cancelada',
};

/** Datas são instantes ISO 8601 em UTC; a exibição converte para o fuso do navegador. */
export interface Consulta {
  id_consulta: string;
  id_medico: string;
  id_paciente: string | null;
  data: string;
  descricao: string | null;
  status: StatusConsulta;
  motivo_cancelamento: string | null;
  data_cancelamento: string | null;
  /** O paciente logado ainda pode desfazer o cancelamento desta consulta. */
  reagendavel: boolean;
  medico: { id_usuario: string; nome: string; especialidade: number | null } | null;
  paciente: { id_usuario: string; nome: string } | null;
}

export interface NovaConsulta {
  /** Obrigatório para administrador; médicos sempre abrem na própria agenda. */
  id_medico?: string;
  data: string;
  descricao?: string;
}

export type EdicaoDeConsulta = Partial<Pick<NovaConsulta, 'data' | 'descricao'>>;
