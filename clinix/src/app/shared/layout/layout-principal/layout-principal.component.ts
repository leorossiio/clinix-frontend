import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { RodapeComponent } from '../rodape/rodape.component';

/** Moldura das páginas internas: cabeçalho, conteúdo da rota e rodapé. */
@Component({
  selector: 'app-layout-principal',
  imports: [RouterOutlet, CabecalhoComponent, RodapeComponent],
  template: `
    <a class="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>
    <app-cabecalho />
    <main id="conteudo" class="pagina">
      <router-outlet />
    </main>
    <app-rodape />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    /* Visível só ao receber foco pelo teclado. */
    .pular-para-conteudo {
      position: absolute;
      left: 8px;
      top: -48px;
      z-index: 10;
      padding: 8px 12px;
      background: #fff;
      border-radius: var(--raio-controle);
    }
    .pular-para-conteudo:focus {
      top: 8px;
    }
  `,
})
export class LayoutPrincipalComponent {}
