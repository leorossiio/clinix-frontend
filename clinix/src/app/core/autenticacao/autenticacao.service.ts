import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../modelos/usuario';
import { SessaoService } from './sessao.service';

interface RespostaDeLogin {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly http = inject(HttpClient);
  private readonly sessao = inject(SessaoService);

  entrar(email: string, senha: string): Observable<RespostaDeLogin> {
    return this.http
      .post<RespostaDeLogin>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap(({ token, usuario }) => this.sessao.iniciar(token, usuario)));
  }

  sair(): void {
    this.sessao.encerrar();
  }
}
