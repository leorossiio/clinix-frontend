import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // API local

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<{ token: string }> {
    const body = { email, senha };
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, body);
  }
}