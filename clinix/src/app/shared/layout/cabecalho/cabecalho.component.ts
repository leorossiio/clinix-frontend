import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AutenticacaoService } from '../../../core/autenticacao/autenticacao.service';
import { SessaoService } from '../../../core/autenticacao/sessao.service';
import { ROTULO_DO_TIPO, TipoUsuario } from '../../../core/modelos/usuario';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive],
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
  protected readonly primeiroNome = computed(() => this.usuario()?.nome.split(' ')[0] ?? '');

  protected sair(): void {
    this.autenticacao.sair();
    void this.router.navigate(['/login']);
  }
}
