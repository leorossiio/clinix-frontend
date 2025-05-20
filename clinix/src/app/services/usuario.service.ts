// src/app/services/usuario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  atualizarUsuario(id: string, dados: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dados);
  }

  deletarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  novoUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, usuario);
  }

}