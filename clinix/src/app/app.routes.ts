import { Routes } from '@angular/router';
import { LoginComponent } from './features/usuarios/components/login/login.component';
import { CadastroPacienteComponent } from './features/usuarios/components/cadastro-paciente/cadastro-paciente.component';
import { HomeComponent } from './features/home/components/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cadastro-paciente', component: CadastroPacienteComponent },
  { path: 'home', component: HomeComponent }
];