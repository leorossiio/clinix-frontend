/**
 * Espelha o contrato da API (docs/openapi.yaml no backend). Os valores
 * numéricos são os mesmos gravados no banco.
 */

export const TipoUsuario = { PACIENTE: 0, MEDICO: 1, ADMIN: 2 } as const;
export type TipoUsuario = (typeof TipoUsuario)[keyof typeof TipoUsuario];

export const StatusUsuario = { ATIVO: 0, EXCLUIDO: 1 } as const;
export type StatusUsuario = (typeof StatusUsuario)[keyof typeof StatusUsuario];

export const ROTULO_DO_TIPO: Record<TipoUsuario, string> = {
  [TipoUsuario.PACIENTE]: 'Paciente',
  [TipoUsuario.MEDICO]: 'Médico',
  [TipoUsuario.ADMIN]: 'Administrador',
};

export const ESPECIALIDADES: readonly { codigo: number; nome: string }[] = [
  { codigo: 0, nome: 'Cardiologia' },
  { codigo: 1, nome: 'Pediatria' },
  { codigo: 2, nome: 'Ortopedia' },
  { codigo: 3, nome: 'Dermatologia' },
  { codigo: 4, nome: 'Neurologia' },
];

export function nomeDaEspecialidade(codigo: number | null | undefined): string {
  return ESPECIALIDADES.find((e) => e.codigo === codigo)?.nome ?? 'Sem especialidade';
}

export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
  status: StatusUsuario;
  especialidade: number | null;
  crm: string | null;
}

export interface CadastroDePaciente {
  nome: string;
  email: string;
  senha: string;
}

/** Campos omitidos não são alterados. */
export type AtualizacaoDeUsuario = Partial<CadastroDePaciente>;
