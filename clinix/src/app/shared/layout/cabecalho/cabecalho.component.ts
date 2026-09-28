import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AutenticacaoService } from '../../../core/autenticacao/autenticacao.service';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { ROTULO_DO_TIPO, TipoUsuario } from '../../../core/modelos/usuario';
import { IconeComponent } from '../../ui/icone/icone.component';
import { MarcaComponent } from '../../ui/marca/marca.component';
import { iniciais as calcularIniciais, primeiroNome } from '../../utils/texto';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive, MarcaComponent, IconeComponent],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  protected readonly usuario = inject(SessaoService).usuario;
  protected readonly ehAdmin = computed(() => this.usuario()?.tipo === TipoUsuario.ADMIN);
  protected readonly perfil = computed(() => {
    const usuario = this.usuario();
    return usuario ? ROTULO_DO_TIPO[usuario.tipo] : '';
  });
  protected readonly primeiroNome = computed(() => primeiroNome(this.usuario()?.nome ?? ''));
  protected readonly iniciais = computed(() => calcularIniciais(this.usuario()?.nome ?? ''));

  protected sair(): void {
    this.autenticacao.sair();
    void this.router.navigate(['/login']);
  }
}
