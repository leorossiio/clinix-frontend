import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ModalCadastroConsultaComponent } from '../modal-cadastro-consulta/modal-cadastro-consulta.component';
// import { ModalAgendarConsultaComponent } from '../modal-agendar-consulta/modal-agendar-consulta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FooterComponent, 
    HeaderComponent, 
    FormsModule, 
    ModalCadastroConsultaComponent, 
    // ModalAgendarConsultaComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalCadastroAberto = false; // Controle do modal de cadastro
  modalAgendarAberto = false; // Controle do modal de agendamento
  consultaSelecionada: any = null; // Consulta que foi clicada

  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';

  consultas = [
    {
      medico: 'Dr. Carlos Setoguti',
      especialidade: 'Cardiologista',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Não agendado'
    },
    {
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Agendado'
    },
    {
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Concluído'
    },
    {
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Cancelado'
    },
  ];

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }

  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }

  salvarConsulta(dadosConsulta: any) {
    console.log('Consulta cadastrada:', dadosConsulta);
    // Aqui você poderia adicionar a nova consulta à lista de consultas
    // this.consultas.push(dadosConsulta);
    this.modalCadastroAberto = false;
  }

  abrirModalAgendarConsulta(consulta: any) {
    this.consultaSelecionada = consulta;
    this.modalAgendarAberto = true;
  }

  fecharModalAgendarConsulta() {
    this.modalAgendarAberto = false;
  }

  agendarConsultaAtualizada(dadosAtualizados: any) {
    if (this.consultaSelecionada) {
      this.consultaSelecionada.status = 'Agendado';
      this.consultaSelecionada.data = dadosAtualizados.data;
      this.consultaSelecionada.horaInicio = dadosAtualizados.horaInicio;
    }
    this.modalAgendarAberto = false;
  }

  excluirConsultaSelecionada() {
    if (this.consultaSelecionada) {
      this.consultas = this.consultas.filter(c => c !== this.consultaSelecionada);
    }
    this.modalAgendarAberto = false;
  }
}
