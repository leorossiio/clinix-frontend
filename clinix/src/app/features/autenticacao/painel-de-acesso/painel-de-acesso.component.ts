import { Component } from '@angular/core';
import { FolhaDeCalendarioComponent } from '../../../shared/ui/folha-de-calendario/folha-de-calendario.component';
import { MarcaComponent } from '../../../shared/ui/marca/marca.component';

/** Lado da marca nas telas de login e cadastro: a folha de calendário mostra o dia de hoje. */
@Component({
  selector: 'app-painel-de-acesso',
  imports: [MarcaComponent, FolhaDeCalendarioComponent],
  template: `
    <app-marca [clara]="true" [tamanho]="34" />
    <div class="conteudo">
      <app-folha-de-calendario class="folha" [data]="hoje" [grande]="true" />
      <p class="titulo">Agende consultas com os especialistas da Clinix.</p>
      <p class="texto">
        Escolha o horário, acompanhe suas consultas e cancele com antecedência quando precisar.
      </p>
    </div>
    <p class="rodape">© {{ ano }} Clinix</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 40px;
      padding: 40px 48px;
      background: var(--tinta);
      color: #fff;
    }
    .conteudo {
      max-width: 420px;
    }
    .folha {
      display: inline-block;
      margin-bottom: 36px;
      transform: rotate(-4deg);
    }
    .titulo {
      font-family: var(--fonte-titulo);
      font-size: clamp(1.8rem, 1.2rem + 1.6vw, 2.5rem);
      font-weight: 650;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .texto {
      margin-top: 16px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 1.05rem;
    }
    .rodape {
      color: rgba(255, 255, 255, 0.55);
      font-size: 0.85rem;
    }
    @media (max-width: 900px) {
      :host {
        padding: 20px 24px;
      }
      .conteudo,
      .rodape {
        display: none;
      }
    }
  `,
})
export class PainelDeAcessoComponent {
  protected readonly hoje = new Date().toISOString();
  protected readonly ano = new Date().getFullYear();
}
