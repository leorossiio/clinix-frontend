import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  templateUrl: './privacidade.component.html',
  styleUrls: ['./privacidade.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class PrivacidadeComponent {}