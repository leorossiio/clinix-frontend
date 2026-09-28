/** Minúsculas, sem acentos e sem espaços nas pontas: "João " e "joao" passam a casar em buscas. */
export function normalizarParaBusca(texto: string | null | undefined): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
