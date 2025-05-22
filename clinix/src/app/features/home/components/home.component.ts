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
  imports: [
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

  nomeMedicoFiltro: string = '';
  descricaoFiltro: string = '';


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
  ) { }

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

  agendarConsulta(consulta: any, event: MouseEvent): void {
    event.stopPropagation();

    const nomeMedico = consulta.medico?.nome || 'o médico selecionado';
    const confirmado = confirm(`Deseja agendar a consulta com ${nomeMedico}?`);
    if (!confirmado) return;

    const payload = this.getPayloadFromToken();
    if (!payload?.id) {
      alert('Erro ao recuperar informações do usuário.');
      return;
    }

    const dadosAgendamento = {
      id_usuario: payload.id
    };

    this.consultaService.agendarConsulta(consulta.id_consulta, dadosAgendamento).subscribe({
      next: () => {
        alert('Consulta agendada com sucesso!');
        this.listarConsultas();
      },
      error: () => {
        alert('Erro ao agendar a consulta. Tente novamente mais tarde.');
      }
    });
  }

  listarConsultas() {
    const serviceCall = this.tipoUsuario === 0
      ? this.consultaService.listarConsultasUsuario()
      : this.consultaService.listarConsultas();

    serviceCall.subscribe({
      next: res => {
        const consultasOrdenadas = res.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        this.enriquecerConsultasComMedico(consultasOrdenadas);
      },
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
      case 2: return 'ConcluídO';
      case 3: return 'Cancelado';
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

  aplicarFiltros() {
    const termoNome = this.nomeMedicoFiltro.toLowerCase().trim();
    const termoDescricao = this.descricaoFiltro.toLowerCase().trim();
    const termoEspecialidade = this.especializacaoSelecionada.toLowerCase().trim();
    const termoStatus = this.statusSelecionado;
    const termoData = this.dataSelecionada;

    this.consultasFiltradas = this.consultas.filter(c => {
      const nomeMedicoOk = termoNome
        ? (c.medico?.nome?.toLowerCase().includes(termoNome) ?? false)
        : true;

      const descricaoOk = termoDescricao
        ? (c.descricao?.toLowerCase().includes(termoDescricao) ?? false)
        : true;

      const especialidadeOk = termoEspecialidade
        ? this.getEspecialidadeMedico(c.medico?.especialidade).toLowerCase() === termoEspecialidade
        : true;

      const statusOk = termoStatus !== ''
        ? c.status?.toString() === termoStatus
        : true;

      const dataOk = termoData
        ? new Date(c.data).toISOString().startsWith(termoData)
        : true;

      return nomeMedicoOk && descricaoOk && especialidadeOk && statusOk && dataOk;
    });
  }


  excluirConsulta(consulta: any, event: MouseEvent) {
    event.stopPropagation();
    const confirmar = confirm(`Deseja excluir permanentemente a consulta com ${consulta.medico?.nome || 'o médico selecionado'}?`);
    if (!confirmar) return;

    this.consultaService.deletarConsulta(consulta.id_consulta).subscribe({
      next: () => {
        alert('Consulta excluída com sucesso!');
        this.listarConsultas();
      },
      error: err => {
        alert('Erro ao excluir a consulta.');
      }
    });
  }

  limparFiltros() {
    this.dataSelecionada = '';
    this.especializacaoSelecionada = '';
    this.statusSelecionado = '';
    this.nomeMedicoFiltro = '';
    this.descricaoFiltro = '';
    this.consultasFiltradas = [...this.consultas];
  }

}