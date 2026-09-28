import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [RouterLink],
  template: `
    <main class="erro">
      <p class="codigo" aria-hidden="true">404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço que você procurou não existe ou foi alterado.</p>
      <a routerLink="/" class="botao botao--primario">Voltar ao início</a>
    </main>
  `,
  styleUrl: './pagina-de-erro.css',
})
export class PaginaNaoEncontradaComponent {}
