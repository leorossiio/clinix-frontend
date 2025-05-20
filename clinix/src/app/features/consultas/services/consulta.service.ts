// src/app/services/consulta.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private baseUrl = environment.apiUrl + '/consultas';

  constructor(private http: HttpClient) {}

  cadastrarConsulta(dados: any): Observable<any> {
  return this.http.post('http://localhost:3000/consultas', dados);
  }

  listarConsultas(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/consultas');
  }

  agendarConsulta(dados: any): Observable<any> {
    return this.http.post(this.baseUrl, dados);
  }

  cancelarConsulta(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  atualizarConsulta(id: string, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dados);
  }
  
}