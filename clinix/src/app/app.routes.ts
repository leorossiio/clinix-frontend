import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/usuarios/components/login/login.component';
import { CadastroPacienteComponent } from './features/usuarios/components/cadastro-paciente/cadastro-paciente.component';
import { HomeComponent } from './features/home/components/home.component';
import { Error403Component } from './features/errors/features/errors/components/error403/error403.component';
import { Error404Component } from './features/errors/features/errors/components/error404/error404.component'
import { ListaUsuariosComponent } from './features/usuarios/components/lista-usuarios/lista-usuarios.component';
import { SobreComponent } from './features/informacoes/components/sobre/sobre.component';
import { TermosComponent } from './features/informacoes/components/termos/termos.component';
import { PrivacidadeComponent } from './features/informacoes/components/privacidade/privacidade.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-paciente', component: CadastroPacienteComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'usuarios',
    component: ListaUsuariosComponent,
    canActivate: [AuthGuard],
    data: { tiposPermitidos: [1, 2] }
  },
  { path: 'sobre', component: SobreComponent, canActivate: [AuthGuard] },
  { path: 'termos', component: TermosComponent, canActivate: [AuthGuard] },
  { path: 'privacidade', component: PrivacidadeComponent, canActivate: [AuthGuard] },
  { path: '403', component: Error403Component },
  { path: '**', component: Error404Component }
];
