import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  imports: [RouterLink],
  template: `
    <main class="erro">
      <p class="codigo" aria-hidden="true">403</p>
      <h1>Acesso negado</h1>
      <p>Seu perfil não tem permissão para acessar esta página.</p>
      <a routerLink="/" class="botao botao--primario">Voltar ao início</a>
    </main>
  `,
  styleUrl: './pagina-de-erro.css',
})
export class AcessoNegadoComponent {}
