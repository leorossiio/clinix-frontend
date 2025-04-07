import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
