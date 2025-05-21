import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  modalCadastroAberto = false;

  constructor(private router: Router) {} // <-- Injeção necessária

  tipoUsuario: number | null = null;

  ngOnInit(): void {
    const payload = this.getPayloadFromToken();
    if (payload) {
      this.tipoUsuario = payload.tipo;
    }
  }

  getPayloadFromToken(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
    } catch {
      return null;
    }
  }

  salvarConsulta(dadosConsulta: any) {
    this.modalCadastroAberto = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
