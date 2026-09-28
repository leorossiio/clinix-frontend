import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consulta, EdicaoDeConsulta, NovaConsulta } from '../../core/modelos/consulta';

/**
 * Acesso HTTP às consultas. O token é anexado pelo autenticacaoInterceptor e
 * todas as ações devolvem a consulta já atualizada pela API.
 */
@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/consultas`;

  /** A API já devolve o recorte do perfil logado (ver GET /consultas no backend). */
  listar(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.url);
  }

  abrirHorario(nova: NovaConsulta): Observable<Consulta> {
    return this.http.post<Consulta>(this.url, nova);
  }

  editar(id: string, alteracoes: EdicaoDeConsulta): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.url}/${id}`, alteracoes);
  }

  remover(id: string): Observable<Consulta> {
    return this.http.delete<Consulta>(`${this.url}/${id}`);
  }

  agendar(id: string): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.url}/${id}/agendar`, null);
  }

  cancelar(id: string, motivo: string): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.url}/${id}/cancelar`, { motivo_cancelamento: motivo });
  }

  reagendar(id: string): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.url}/${id}/reagendar`, null);
  }
}
