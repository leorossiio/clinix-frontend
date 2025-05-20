import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css']
})
export class Error403Component {
  constructor(private router: Router) {}

  voltar() {
    this.router.navigate(['/login']);
  }
}