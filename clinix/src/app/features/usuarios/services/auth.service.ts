import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, senha: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          const payload = JSON.parse(atob(res.token.split('.')[1]));
          localStorage.setItem('tipo', String(payload.tipo)); // Armazena tipo do usuário
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTipoUsuario(): number | null {
    const tipo = localStorage.getItem('tipo');
    return tipo !== null ? Number(tipo) : null;
  }

  isAutenticado(): boolean {
    return !!this.getToken();
  }
}