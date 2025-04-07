import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NovoUsuarioPaciente {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: number;
}

export interface UsuarioLogado {
  id_usuario: string;
  nome: string;
  email: string;
  tipo_usuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClinixService {
  private apiUrl = 'http://localhost:3000'; // <-- sua API local

  constructor(private http: HttpClient) {}

  
}