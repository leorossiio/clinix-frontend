export interface PayloadDoToken {
  /** Id do usuário (claim padrão "subject"). */
  sub?: string;
  tipo?: number;
  /** Expiração em segundos desde 1970 (claim padrão). */
  exp?: number;
}

/**
 * Lê o payload de um JWT SEM validar a assinatura — isso é papel do backend.
 * No frontend serve apenas para saber quando a sessão expira.
 *
 * JWT usa base64url ("-" e "_" no lugar de "+" e "/", sem "="), que o atob()
 * não aceita diretamente; por isso a conversão antes de decodificar.
 */
export function lerPayloadDoToken(token: string): PayloadDoToken | null {
  const [, payload] = token.split('.');
  if (!payload) return null;
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const binario = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binario, (caractere) => caractere.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as PayloadDoToken;
  } catch {
    return null;
  }
}
