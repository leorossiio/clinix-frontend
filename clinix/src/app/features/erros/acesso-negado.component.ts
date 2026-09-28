import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarcaComponent } from '../../shared/ui/marca/marca.component';

@Component({
  selector: 'app-acesso-negado',
  imports: [RouterLink, MarcaComponent],
  template: `
    <main class="erro">
      <a routerLink="/" aria-label="Clinix, página inicial"><app-marca /></a>
      <div class="conteudo">
        <p class="codigo" aria-hidden="true">403</p>
        <h1>Acesso negado</h1>
        <p>Seu perfil não tem permissão para abrir esta página.</p>
        <a routerLink="/" class="botao botao--primario">Voltar ao início</a>
      </div>
    </main>
  `,
  styleUrl: './pagina-de-erro.css',
})
export class AcessoNegadoComponent {}
