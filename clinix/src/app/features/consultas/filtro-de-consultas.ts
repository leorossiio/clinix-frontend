import { Consulta, StatusConsulta } from '../../core/modelos/consulta';
import { fimDoDia, inicioDoDia } from '../../shared/utils/datas';
import { normalizarParaBusca } from '../../shared/utils/texto';

export interface FiltroDeConsultas {
  medico: string;
  descricao: string;
  especialidade: number | null;
  status: StatusConsulta | null;
  /** "AAAA-MM-DD", inclusive. */
  dataInicio: string;
  /** "AAAA-MM-DD", inclusive. */
  dataFim: string;
}

export const FILTRO_VAZIO: FiltroDeConsultas = {
  medico: '',
  descricao: '',
  especialidade: null,
  status: null,
  dataInicio: '',
  dataFim: '',
};

/** Critérios vazios não filtram; os preenchidos precisam ser TODOS atendidos. */
export function filtrarConsultas(consultas: Consulta[], filtro: FiltroDeConsultas): Consulta[] {
  const medico = normalizarParaBusca(filtro.medico);
  const descricao = normalizarParaBusca(filtro.descricao);
  const inicio = filtro.dataInicio ? inicioDoDia(filtro.dataInicio) : null;
  const fim = filtro.dataFim ? fimDoDia(filtro.dataFim) : null;

  return consultas.filter((consulta) => {
    const data = new Date(consulta.data);
    return (
      normalizarParaBusca(consulta.medico?.nome).includes(medico) &&
      normalizarParaBusca(consulta.descricao).includes(descricao) &&
      (filtro.especialidade === null || consulta.medico?.especialidade === filtro.especialidade) &&
      (filtro.status === null || consulta.status === filtro.status) &&
      (!inicio || data >= inicio) &&
      (!fim || data <= fim)
    );
  });
}
