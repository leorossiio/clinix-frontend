import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  atualizarUsuario(id: string, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dados, {
      headers: this.getAuthHeaders()
    });
  }

  deletarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  novoUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, usuario, {
      headers: this.getAuthHeaders()
    });
  }
}