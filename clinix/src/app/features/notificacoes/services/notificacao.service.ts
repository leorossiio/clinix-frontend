// src/app/services/notificacao.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private baseUrl = environment.apiUrl + '/notificacoes';

  constructor(private http: HttpClient) {}

  listarNotificacoes(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  criarNotificacao(dados: any): Observable<any> {
    return this.http.post(this.baseUrl, dados);
  }

  marcarComoLida(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/lida`, {});
  }

  deletarNotificacao(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}