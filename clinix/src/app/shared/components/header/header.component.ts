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


  salvarConsulta(dadosConsulta: any) {
    this.modalCadastroAberto = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
