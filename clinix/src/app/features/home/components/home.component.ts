import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

import { ModalCadastroConsultaComponent } from '../../modais/modal-cadastro-consulta/modal-cadastro-consulta.component';
import { ModalAtualizacaoConsultaComponent } from '../../modais/modal-atualizacao-consulta/modal-atualizacao-consulta.component';

import { ConsultaService } from '../../consultas/services/consulta.service';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { AuthService } from '../../usuarios/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports:[
    CommonModule,
    FormsModule,
    FooterComponent,
    HeaderComponent,
    ModalCadastroConsultaComponent,
    ModalAtualizacaoConsultaComponent
  ]
})
export class HomeComponent implements OnInit {
  consultas: any[] = [];
  consultasFiltradas: any[] = [];

  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';

  modalCadastroAberto = false;
  modalAtualizacaoConsulta = false;
  consultaSelecionada: any = null;

  id_usuario: string = '';
  id_medico: string = '';
  tipoUsuario: number | null = null;

  constructor(
    private consultaService: ConsultaService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const payload = this.getPayloadFromToken();
    if (payload) {
      this.tipoUsuario = payload.tipo;
      if (payload.tipo === 0) this.id_usuario = payload.id;
      if (payload.tipo === 1) this.id_medico = payload.id;
    }
    this.listarConsultas();
  }

  getPayloadFromToken(): any | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
    } catch {
      return null;
    }
  }

  listarConsultas() {
    const serviceCall = this.tipoUsuario === 0
      ? this.consultaService.listarConsultasUsuario()
      : this.consultaService.listarConsultas();

    serviceCall.subscribe({
      next: res => this.enriquecerConsultasComMedico(res),
      error: err => console.error('Erro ao carregar consultas:', err)
    });
  }

  enriquecerConsultasComMedico(consultas: any[]) {
    const requisicoes = consultas.map(consulta =>
      this.usuarioService.buscarPorId(consulta.id_medico)
    );

    forkJoin(requisicoes).subscribe({
      next: medicos => {
        this.consultas = consultas.map((consulta, index) => ({
          ...consulta,
          medico: medicos[index]
        }));
        this.consultasFiltradas = [...this.consultas];
      },
      error: err => console.error('Erro ao buscar médicos:', err)
    });
  }

  getStatusDescricao(status: number): string {
    switch (status) {
      case 0: return 'Não agendado';
      case 1: return 'Agendado';
      case 2: return 'Concluída';
      case 3: return 'Cancelada';
      default: return 'Desconhecido';
    }
  }

  getEspecialidadeMedico(especialidade: number): string {
    switch (especialidade) {
      case 0: return 'Cardiologia';
      case 1: return 'Pediatria';
      case 2: return 'Ortopedia';
      case 3: return 'Dermatologia';
      case 4: return 'Neurologia';
      default: return 'Sem especialidade';
    }
  }

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  }

  formatarHora(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }

  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }

  consultaCriada() {
    this.fecharModalCadastro();
    this.listarConsultas();
  }

  abrirModalAtualizacaoConsulta(consulta: any) {
    this.consultaSelecionada = { ...consulta };
    this.modalAtualizacaoConsulta = true;
  }

  fecharModalAtualizacao() {
    this.modalAtualizacaoConsulta = false;
    this.consultaSelecionada = null;
  }

  salvarConsultaAtualizada(dados: any) {
    if (!this.consultaSelecionada?.id_consulta) return;

    this.consultaService.atualizarConsulta(this.consultaSelecionada.id_consulta, dados)
      .subscribe({
        next: () => {
          this.fecharModalAtualizacao();
          this.listarConsultas();
        },
        error: err => console.error('Erro ao atualizar consulta:', err)
      });
  }

  excluirConsulta(consulta: any, event: MouseEvent) {
    event.stopPropagation();
    const confirmar = confirm(`Deseja excluir a consulta com ${consulta.medico?.nome || 'o médico selecionado'}?`);
    if (confirmar) {
      this.consultaService.cancelarConsulta(consulta.id_consulta).subscribe({
        next: () => this.listarConsultas(),
        error: err => console.error('Erro ao excluir consulta:', err)
      });
    }
  }

  aplicarFiltros() {
    this.consultasFiltradas = this.consultas.filter(c => {
      const especialidadeOk = this.especializacaoSelecionada
        ? this.getEspecialidadeMedico(c.medico?.especialidade).toLowerCase() === this.especializacaoSelecionada.toLowerCase()
        : true;

      const statusOk = this.statusSelecionado !== ''
        ? c.status?.toString() === this.statusSelecionado
        : true;

      const dataOk = this.dataSelecionada
        ? c.data.startsWith(this.dataSelecionada)
        : true;

      return especialidadeOk && statusOk && dataOk;
    });
  }

  limparFiltros() {
    this.dataSelecionada = '';
    this.especializacaoSelecionada = '';
    this.statusSelecionado = '';
    this.consultasFiltradas = [...this.consultas];
  }
}