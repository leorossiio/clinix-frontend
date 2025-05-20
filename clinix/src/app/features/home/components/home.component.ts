import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ModalCadastroConsultaComponent } from '../../modais/modal-cadastro-consulta/modal-cadastro-consulta.component';
import { ModalAtualizacaoConsultaComponent } from '../../modais/modal-atualizacao-consulta/modal-atualizacao-consulta.component';
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
    ModalAtualizacaoConsultaComponent, 
    // ModalAgendarConsultaComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalCadastroAberto = false; // Controle do modal de cadastro
  modalAgendarAberto = false; // Controle do modal de agendamento
  consultaSelecionada: any = null; // Consulta que foi clicada
  modalAtualizacaoConsulta = false;
  

  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';

  consultas = [
    {
      id: '1',
      medico: 'Dr. Carlos Setoguti',
      especialidade: 'Cardiologista',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Não agendado'
    },
    {
      id: '2',
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Agendado'
    },
    {
      id: '3',  
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Concluído'
    },
    {
      id: '4',
      medico: 'Dr. Carla Almeida',
      especialidade: 'Pediatra',
      horaInicio: '8:00',
      descricao: 'Texto',
      data: '06/04/2025',
      status: 'Cancelado'
    },
  ];
console: any;

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

  excluirConsulta(consulta: any, event: MouseEvent) {
  event.stopPropagation(); // evita abrir o modal ao clicar no botão
  const confirmar = confirm(`Deseja excluir a consulta com ${consulta.medico}?`);
  if (confirmar) {
    this.consultas = this.consultas.filter(c => c.id !== consulta.id);
  }
  }


abrirModalAtualizacaoConsulta(consulta: any) {
  console.log('clicou');
  this.consultaSelecionada = { ...consulta }; // Faz uma cópia para evitar alterar direto
  this.modalAtualizacaoConsulta = true;
}

fecharModalAtualizacao() {
  this.modalAtualizacaoConsulta = false;
  this.consultaSelecionada = null;
}

salvarConsultaAtualizada(dadosAtualizados: any) {
  const index = this.consultas.findIndex(c => c.id === dadosAtualizados.id);
  if (index !== -1) {
    this.consultas[index] = dadosAtualizados;
  }
  this.fecharModalAtualizacao();
}


}
