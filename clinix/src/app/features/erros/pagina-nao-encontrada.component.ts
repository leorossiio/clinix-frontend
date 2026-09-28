import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarcaComponent } from '../../shared/ui/marca/marca.component';

@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [RouterLink, MarcaComponent],
  template: `
    <main class="erro">
      <a routerLink="/" aria-label="Clinix, página inicial"><app-marca /></a>
      <div class="conteudo">
        <p class="codigo" aria-hidden="true">404</p>
        <h1>Página não encontrada</h1>
        <p>O endereço que você abriu não existe ou foi alterado.</p>
        <a routerLink="/" class="botao botao--primario">Voltar ao início</a>
      </div>
    </main>
  `,
  styleUrl: './pagina-de-erro.css',
})
export class PaginaNaoEncontradaComponent {}
