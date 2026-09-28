import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizacaoDeUsuario, CadastroDePaciente, Usuario } from '../../core/modelos/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/usuarios`;

  /** Somente administradores. */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  listarMedicos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/medicos`);
  }

  /** Público: sempre cria um paciente. */
  cadastrarPaciente(cadastro: CadastroDePaciente): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, cadastro);
  }

  atualizar(id: string, alteracoes: AtualizacaoDeUsuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, alteracoes);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
