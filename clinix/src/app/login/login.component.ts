import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ClinixService } from '../services/clinix.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  showPassword = false;

  constructor(
    private clinixService: ClinixService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}