import { HttpErrorResponse } from '@angular/common/http';

const SEM_CONEXAO = 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';

/**
 * Extrai uma mensagem apresentável de um erro. A API responde sempre no
 * formato { error: "mensagem" } — ver o tratamento de erros do backend.
 */
export function mensagemDeErro(
  erro: unknown,
  padrao = 'Não foi possível concluir a operação. Tente novamente.',
): string {
  if (!(erro instanceof HttpErrorResponse)) return padrao;
  if (erro.status === 0) return SEM_CONEXAO;
  const mensagemDaApi: unknown = erro.error?.error;
  return typeof mensagemDaApi === 'string' && mensagemDaApi ? mensagemDaApi : padrao;
}
