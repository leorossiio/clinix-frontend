import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ModalCadastroConsultaComponent } from '../modal-cadastro-consulta/modal-cadastro-consulta.component';
import { ModalAtualizacaoConsultaComponent } from '../modal-atualizacao-consulta/modal-atualizacao-consulta.component';
// import { ModalAgendarConsultaComponent } from '../modal-agendar-consulta/modal-agendar-consulta.component';
import { ConsultaService } from '../../services/consulta.service'; // ajuste o caminho conforme sua pasta


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
  constructor(private consultaService: ConsultaService) {}

  modalCadastroAberto = false; // Controle do modal de cadastro
  modalAgendarAberto = false; // Controle do modal de agendamento
  consultaSelecionada: any = null; // Consulta que foi clicada
  modalAtualizacaoConsulta = false;
  

  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';
  id_usuario = '057794e9-8130-4889-b62d-7950ff5f071d';
  id_medico = 'ac60ecff-7634-49ec-a93d-960153ae6950';

  consultas: any[] = [];

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

criarConsulta(dadosConsulta: any) {
  this.consultaService.cadastrarConsulta(dadosConsulta).subscribe({
    next: res => {
      console.log('Consulta criada com sucesso:', res);
      this.fecharModalCadastro(); // ou atualizar a lista
    },
    error: err => {
      console.error('Erro ao criar consulta:', err);
    }
  });
}

}
