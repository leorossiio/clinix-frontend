import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  showPassword = false;
  erro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  fazerLogin() {
    const credenciais = {
      email: this.email,
      senha: this.senha
    };

    this.authService.login(credenciais).subscribe({
      next: (res) => {
        console.log('Login realizado com sucesso:', res);
        // Armazenar token, se necessário
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        this.erro = 'Usuário ou senha incorretos.';
      }
    });

    console.log(credenciais);
  }
}