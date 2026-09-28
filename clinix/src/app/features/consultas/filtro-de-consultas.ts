import { Consulta, StatusConsulta } from '../../core/modelos/consulta';
import { nomeDaEspecialidade } from '../../core/modelos/usuario';
import { fimDoDia, inicioDoDia } from '../../shared/utils/datas';
import { normalizarParaBusca } from '../../shared/utils/texto';

export interface FiltroDeConsultas {
  /** Procura no nome do médico e do paciente, na descrição e na especialidade. */
  busca: string;
  especialidade: number | null;
  status: StatusConsulta | null;
  /** "AAAA-MM-DD", inclusive. */
  dataInicio: string;
  /** "AAAA-MM-DD", inclusive. */
  dataFim: string;
}

export const FILTRO_VAZIO: FiltroDeConsultas = {
  busca: '',
  especialidade: null,
  status: null,
  dataInicio: '',
  dataFim: '',
};

/** Critérios vazios não filtram; os preenchidos precisam ser TODOS atendidos. */
export function filtrarConsultas(consultas: Consulta[], filtro: FiltroDeConsultas): Consulta[] {
  const busca = normalizarParaBusca(filtro.busca);
  const inicio = filtro.dataInicio ? inicioDoDia(filtro.dataInicio) : null;
  const fim = filtro.dataFim ? fimDoDia(filtro.dataFim) : null;

  return consultas.filter((consulta) => {
    const data = new Date(consulta.data);
    return (
      (!busca || textoPesquisavel(consulta).includes(busca)) &&
      (filtro.especialidade === null || consulta.medico?.especialidade === filtro.especialidade) &&
      (filtro.status === null || consulta.status === filtro.status) &&
      (!inicio || data >= inicio) &&
      (!fim || data <= fim)
    );
  });
}

function textoPesquisavel(consulta: Consulta): string {
  const codigo = consulta.medico?.especialidade;
  const especialidade = codigo === null || codigo === undefined ? '' : nomeDaEspecialidade(codigo);
  return normalizarParaBusca(
    [consulta.medico?.nome, consulta.paciente?.nome, consulta.descricao, especialidade]
      .filter(Boolean)
      .join(' '),
  );
}
