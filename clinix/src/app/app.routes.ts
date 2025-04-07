import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroPacienteComponent } from './cadastro-paciente/cadastro-paciente.component';
import { HomeComponent } from './autenticadas/home/home.component'; // seu componente de Home

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cadastro-paciente', component: CadastroPacienteComponent },
  { path: 'home', component: HomeComponent }
];