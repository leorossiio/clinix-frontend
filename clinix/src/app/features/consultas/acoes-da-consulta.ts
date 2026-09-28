import { Consulta, StatusConsulta } from '../../core/modelos/consulta';
import { TipoUsuario } from '../../core/modelos/usuario';

export interface AcoesDaConsulta {
  agendar: boolean;
  cancelar: boolean;
  reagendar: boolean;
  editar: boolean;
  remover: boolean;
  /** Explica por que uma ação esperada não está disponível. */
  aviso: string | null;
}

export const SEM_ACOES: AcoesDaConsulta = Object.freeze({
  agendar: false,
  cancelar: false,
  reagendar: false,
  editar: false,
  remover: false,
  aviso: null,
});

const ANTECEDENCIA_MINIMA_CANCELAMENTO_MS = 24 * 60 * 60 * 1000;

/**
 * Decide quais botões mostrar para cada consulta. Espelha as regras do
 * backend só para orientar o usuário — quem garante as regras é a API.
 */
export function acoesDaConsulta(
  consulta: Consulta,
  usuario: { id: string; tipo: TipoUsuario },
  agora: Date,
): AcoesDaConsulta {
  const acoes: AcoesDaConsulta = { ...SEM_ACOES };
  const msAteConsulta = new Date(consulta.data).getTime() - agora.getTime();

  if (usuario.tipo === TipoUsuario.PACIENTE) {
    const ehDoPaciente = consulta.id_paciente === usuario.id;
    acoes.agendar = consulta.status === StatusConsulta.DISPONIVEL && msAteConsulta > 0;
    acoes.reagendar = consulta.reagendavel;
    if (consulta.status === StatusConsulta.AGENDADA && ehDoPaciente) {
      acoes.cancelar = msAteConsulta >= ANTECEDENCIA_MINIMA_CANCELAMENTO_MS;
      if (!acoes.cancelar && msAteConsulta > 0) {
        acoes.aviso = 'Cancelamento disponível até 24 horas antes da consulta.';
      }
    }
    return acoes;
  }

  const gerenciaAgenda = usuario.tipo === TipoUsuario.ADMIN || consulta.id_medico === usuario.id;
  const estaAtiva =
    consulta.status === StatusConsulta.DISPONIVEL || consulta.status === StatusConsulta.AGENDADA;
  acoes.editar = acoes.remover = gerenciaAgenda && estaAtiva;
  return acoes;
}
