import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro-paciente',
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class CadastroPacienteComponent {
  showPassword = false;
  showConfirmPassword = false;

  paciente = {
    nome: '',
    email: '',
    senha: ''
  };

  confirmarSenha = '';
  senhaNaoConfere = false;
  mensagem = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  cadastrar() {
    this.senhaNaoConfere = this.paciente.senha !== this.confirmarSenha;

    if (this.senhaNaoConfere) return;

    this.usuarioService.novoUsuario(this.paciente).subscribe({
      next: () => {
        this.mensagem = 'Cadastro realizado com sucesso!';
        this.paciente = { nome: '', email: '', senha: '' };
        this.confirmarSenha = '';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.mensagem = err.error?.error || 'Erro ao cadastrar usuário.';
      }
    });
  }
}