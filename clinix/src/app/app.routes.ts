import { Routes } from '@angular/router';
import { autenticadoGuard, perfilGuard, visitanteGuard } from './core/autenticacao/guards';
import { TipoUsuario } from './core/modelos/usuario';
import { LayoutPrincipalComponent } from './shared/layout/layout-principal/layout-principal.component';

/**
 * Cada página é carregada sob demanda (lazy loading): o paciente não baixa o
 * código da administração de usuários, por exemplo.
 */
export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · Clinix',
    canActivate: [visitanteGuard],
    loadComponent: () =>
      import('./features/autenticacao/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro',
    title: 'Cadastro · Clinix',
    canActivate: [visitanteGuard],
    loadComponent: () =>
      import('./features/autenticacao/cadastro-paciente/cadastro-paciente.component').then(
        (m) => m.CadastroPacienteComponent,
      ),
  },
  {
    path: '',
    component: LayoutPrincipalComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'consultas' },
      {
        path: 'consultas',
        title: 'Consultas · Clinix',
        canActivate: [autenticadoGuard],
        loadComponent: () =>
          import('./features/consultas/pagina-consultas/pagina-consultas.component').then(
            (m) => m.PaginaConsultasComponent,
          ),
      },
      {
        path: 'usuarios',
        title: 'Usuários · Clinix',
        canActivate: [autenticadoGuard, perfilGuard(TipoUsuario.ADMIN)],
        loadComponent: () =>
          import('./features/usuarios/lista-usuarios/lista-usuarios.component').then(
            (m) => m.ListaUsuariosComponent,
          ),
      },
      // Páginas institucionais são públicas: precisam ser lidas antes do cadastro.
      {
        path: 'sobre',
        title: 'Sobre · Clinix',
        loadComponent: () =>
          import('./features/institucional/sobre/sobre.component').then((m) => m.SobreComponent),
      },
      {
        path: 'termos',
        title: 'Termos de Uso · Clinix',
        loadComponent: () =>
          import('./features/institucional/termos/termos.component').then((m) => m.TermosComponent),
      },
      {
        path: 'privacidade',
        title: 'Política de Privacidade · Clinix',
        loadComponent: () =>
          import('./features/institucional/privacidade/privacidade.component').then(
            (m) => m.PrivacidadeComponent,
          ),
      },
    ],
  },
  // Endereços da versão anterior, mantidos para não quebrar favoritos.
  { path: 'home', redirectTo: 'consultas' },
  { path: 'cadastro-paciente', redirectTo: 'cadastro' },
  {
    path: '403',
    title: 'Acesso negado · Clinix',
    loadComponent: () =>
      import('./features/erros/acesso-negado.component').then((m) => m.AcessoNegadoComponent),
  },
  {
    path: '**',
    title: 'Página não encontrada · Clinix',
    loadComponent: () =>
      import('./features/erros/pagina-nao-encontrada.component').then(
        (m) => m.PaginaNaoEncontradaComponent,
      ),
  },
];
