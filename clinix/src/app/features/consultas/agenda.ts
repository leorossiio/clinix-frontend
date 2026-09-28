import { Consulta, StatusConsulta } from '../../core/modelos/consulta';

export interface DiaDaAgenda {
  /** "AAAA-MM-DD" no fuso do navegador; serve de chave de rastreamento. */
  chave: string;
  /** Ex.: "Quarta-feira, 30 de setembro". */
  rotulo: string;
  relativo: 'Hoje' | 'Amanhã' | null;
  consultas: Consulta[];
}

const porData = (a: Consulta, b: Consulta) => Date.parse(a.data) - Date.parse(b.data);

/**
 * Organiza consultas como uma agenda de papel: um bloco por dia, dias e
 * horários em ordem cronológica. Os dias são os do fuso do navegador.
 */
export function agruparPorDia(consultas: Consulta[], agora: Date): DiaDaAgenda[] {
  const dias = new Map<string, DiaDaAgenda>();
  for (const consulta of [...consultas].sort(porData)) {
    const data = new Date(consulta.data);
    const chave = chaveDoDia(data);
    if (!dias.has(chave)) {
      dias.set(chave, {
        chave,
        rotulo: rotuloDoDia(data, agora),
        relativo: relativo(chave, agora),
        consultas: [],
      });
    }
    dias.get(chave)!.consultas.push(consulta);
  }
  return [...dias.values()];
}

/**
 * Na visão do paciente, as consultas dele (qualquer situação) ficam à parte
 * dos horários livres para agendar.
 */
export function separarParaPaciente(
  consultas: Consulta[],
  idPaciente: string,
): { proprias: Consulta[]; livres: Consulta[] } {
  const proprias = consultas
    .filter((c) => c.id_paciente === idPaciente && c.status !== StatusConsulta.DISPONIVEL)
    .sort(porData);
  const livres = consultas.filter((c) => c.status === StatusConsulta.DISPONIVEL);
  return { proprias, livres };
}

function chaveDoDia(data: Date): string {
  const doisDigitos = (n: number) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

function relativo(chave: string, agora: Date): DiaDaAgenda['relativo'] {
  const amanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1);
  if (chave === chaveDoDia(agora)) return 'Hoje';
  if (chave === chaveDoDia(amanha)) return 'Amanhã';
  return null;
}

function rotuloDoDia(data: Date, agora: Date): string {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(data.getFullYear() !== agora.getFullYear() ? { year: 'numeric' } : {}),
  }).format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
