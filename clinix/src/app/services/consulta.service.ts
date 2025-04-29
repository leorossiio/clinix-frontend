// src/app/services/consulta.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private baseUrl = 'http://localhost:3000/consultas';

  constructor(private http: HttpClient) {}

  listarConsultas(): Observable<any> {
    return this.http.get(this.baseUrl);
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