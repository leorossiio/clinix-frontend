/** Minúsculas, sem acentos e sem espaços nas pontas: "João " e "joao" passam a casar em buscas. */
export function normalizarParaBusca(texto: string | null | undefined): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Pronomes de tratamento que não fazem parte do nome ("Dra. Helena Prado"). */
const TRATAMENTOS = /^(dr|dra|sr|sra|srta)\.?$/i;

function partesDoNome(nome: string): string[] {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return partes.length > 1 && TRATAMENTOS.test(partes[0]) ? partes.slice(1) : partes;
}

/** "Dr. Rafael Lima" → "Rafael". Usado em saudações. */
export function primeiroNome(nome: string): string {
  return partesDoNome(nome)[0] ?? '';
}

/** "Paula Maria Souza" → "PS"; "Dra. Helena Prado" → "HP"; "admin" → "A". Usado nos avatares. */
export function iniciais(nome: string): string {
  const partes = partesDoNome(nome);
  if (partes.length === 0) return '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (partes[0][0] + ultima).toUpperCase();
}
