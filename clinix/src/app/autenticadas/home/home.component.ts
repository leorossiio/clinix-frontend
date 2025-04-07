import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ModalCadastroConsultaComponent } from '../modal-cadastro-consulta/modal-cadastro-consulta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, FormsModule, ModalCadastroConsultaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalCadastroAberto = false;

  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';
  consultas = [
    {
      medico: 'Dr. Carlos Setoguti',
      especialidade: 'Cardiologista',
      horaInicio: '8:00',
      horaFim: '9:00',
      data: '06/04/2025'
    },
    {
      medico: 'Dr. Leonardo Rossi',
      especialidade: 'Pediatra',
      horaInicio: '9:00',
      horaFim: '10:00',
      data: '06/04/2025'
    },
    {
      medico: 'Dr. Leonardo Rossi',
      especialidade: 'Pediatra',
      horaInicio: '9:00',
      horaFim: '10:00',
      data: '06/04/2025'
    },
    {
      medico: 'Dr. Leonardo Rossi',
      especialidade: 'Pediatra',
      horaInicio: '9:00',
      horaFim: '10:00',
      data: '06/04/2025'
    },
    {
      medico: 'Dr. Leonardo Rossi',
      especialidade: 'Pediatra',
      horaInicio: '9:00',
      horaFim: '10:00',
      data: '06/04/2025'
    },
    // Adicione mais consultas...
  ];

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }
  salvarConsulta(dadosConsulta: any) {
    console.log('Consulta cadastrada:', dadosConsulta);
    // Aqui você pode chamar o service para salvar no backend
    this.modalCadastroAberto = false;
  }
  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }
}
