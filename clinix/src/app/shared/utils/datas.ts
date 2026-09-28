/**
 * Conversões entre o formato dos inputs HTML e o da API.
 *
 * A API trabalha com instantes ISO 8601 em UTC ("2026-10-01T17:30:00.000Z").
 * Inputs `datetime-local` trabalham com horário local sem fuso ("2026-10-01T14:30").
 */

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** "2026-10-01T14:30" (horário local do navegador) → instante ISO UTC. */
export function paraInstanteIso(valorDatetimeLocal: string): string {
  return new Date(valorDatetimeLocal).toISOString();
}

/** Instante → "2026-10-01T14:30" no horário local, para preencher um datetime-local. */
export function paraDatetimeLocal(instante: string | Date): string {
  const d = new Date(instante);
  return (
    `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}` +
    `T${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`
  );
}

/** "2026-10-01" (input date) → 00:00:00.000 local desse dia. */
export function inicioDoDia(valorDate: string): Date {
  const [ano, mes, dia] = valorDate.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
}

/** "2026-10-01" (input date) → 23:59:59.999 local desse dia. */
export function fimDoDia(valorDate: string): Date {
  const [ano, mes, dia] = valorDate.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 23, 59, 59, 999);
}
