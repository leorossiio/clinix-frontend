import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private baseUrl = environment.apiUrl + '/consultas';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarConsultas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  listarConsultasUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario`, {
      headers: this.getAuthHeaders()
    });
  }

  cadastrarConsulta(dados: any): Observable<any> {
    return this.http.post(this.baseUrl, dados, {
      headers: this.getAuthHeaders()
    });
  }

  atualizarConsulta(id: string, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dados, {
      headers: this.getAuthHeaders()
    });
  }

  deletarConsulta(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  agendarConsulta(id: string, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/agendar`, dados, {
      headers: this.getAuthHeaders()
    });
  }
}