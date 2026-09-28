import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessaoService } from './sessao.service';

/**
 * Anexa o token às chamadas para a NOSSA API (nunca a outros domínios) e,
 * se a API recusar a sessão com 401, faz logout e leva ao login.
 */
export const autenticacaoInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const sessao = inject(SessaoService);
  const router = inject(Router);
  const token = sessao.token;
  const paraApi = requisicao.url.startsWith(environment.apiUrl);

  const autenticada =
    token && paraApi
      ? requisicao.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : requisicao;

  return proximo(autenticada).pipe(
    catchError((erro: unknown) => {
      // Sem token, um 401 é só "senha errada" no login — não uma sessão expirada.
      if (erro instanceof HttpErrorResponse && erro.status === 401 && token && paraApi) {
        sessao.encerrar();
        void router.navigate(['/login'], { queryParams: { sessao: 'expirada' } });
      }
      return throwError(() => erro);
    }),
  );
};
