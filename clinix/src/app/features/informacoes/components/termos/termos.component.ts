import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-termos',
  standalone: true,
  templateUrl: './termos.component.html',
  styleUrls: ['./termos.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class TermosComponent {}