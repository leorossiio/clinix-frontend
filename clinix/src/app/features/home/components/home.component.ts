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
import { ModalCancelarConsultaComponent } from '../../modais/modal-cancelar-consulta/modal-cancelar-consulta.component';

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
    ModalAtualizacaoConsultaComponent,
    ModalCancelarConsultaComponent
  ]
})
export class HomeComponent implements OnInit {
  consultas: any[] = [];
  consultasFiltradas: any[] = [];
  nomeMedicoFiltro: string = '';
  descricaoFiltro: string = '';
  dataInicio: string = '';
  dataFim: string = '';
  dataSelecionada: string = '';
  especializacaoSelecionada: string = '';
  statusSelecionado: string = '';
  modalCadastroAberto = false;
  modalAtualizacaoConsulta = false;
  consultaSelecionada: any = null;
  id_usuario: string = '';
  id_medico: string = '';
  tipoUsuario: number | null = null;
  showModalCancelar = false;
  consultaParaCancelar: any = null;
  loading: boolean = false;

  // NOVA PROPRIEDADE
  idConsultaReagendavel: string | null = null;

  constructor(
    private consultaService: ConsultaService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const payload = this.getPayloadFromToken();
    if (payload) {
      this.tipoUsuario = payload.tipo;
      if (payload.tipo === 0) {
        this.id_usuario = payload.id;
        this.verificarReagendamento(); // Chama a verificação para o paciente
      }
      if (payload.tipo === 1) this.id_medico = payload.id;
    }

    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    this.dataFim = this.toDateTimeLocalBrasilia(hoje);
    this.dataInicio = this.toDateTimeLocalBrasilia(trintaDiasAtras);

    this.listarConsultas();
  }

  // NOVA FUNÇÃO
  verificarReagendamento() {
    if (!this.id_usuario) return;
    this.consultaService.verificarConsultaParaReagendar(this.id_usuario).subscribe({
      next: (consulta) => {
        if (consulta && consulta.length > 0) {
          this.idConsultaReagendavel = consulta[0].id_consulta;
        }
      },
      error: () => {
        this.idConsultaReagendavel = null;
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
        this.enriquecerConsultasComNomes(consultasOrdenadas);
      },
      error: err => console.error('Erro ao carregar consultas:', err)
    });
  }

  reagendarConsulta(consulta: any, event: MouseEvent): void {
    event.stopPropagation();
    const nomeMedico = consulta.medico?.nome || 'o médico selecionado';
    const confirmado = confirm(`A consulta com ${nomeMedico} será reativada. Deseja confirmar?`);
    if (!confirmado) return;

    const payload = this.getPayloadFromToken();
    if (!payload?.id) {
      alert('Erro ao recuperar informações do usuário.');
      return;
    }

    const dadosReagendamento = {
      id_usuario: payload.id
    };

    this.consultaService.reagendarConsulta(consulta.id_consulta, dadosReagendamento).subscribe({
      next: () => {
        alert('Consulta re-agendada com sucesso!');
        this.idConsultaReagendavel = null; // Limpa o ID após reagendar
        this.listarConsultas();
      },
      error: () => {
        alert('Erro ao reagendar a consulta. Tente novamente mais tarde.');
      }
    });
  }
  
  // O restante do seu arquivo .ts continua igual...
  toDateTimeLocalBrasilia(date: Date): string {
    const utc = date.getUTCFullYear();
    const mes = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const dia = ('0' + date.getUTCDate()).slice(-2);
    const hora = ('0' + (date.getUTCHours() - 3)).slice(-2);
    const min = ('0' + date.getUTCMinutes()).slice(-2);
    return `${utc}-${mes}-${dia}T${hora}:${min}`;
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

  cancelarConsulta(consulta: any, event: MouseEvent) {
    event.stopPropagation();
    this.consultaParaCancelar = consulta;
    this.showModalCancelar = true;
  }

  confirmarCancelamento(motivo: string) {
    if (!this.consultaParaCancelar?.id_consulta) return;

    this.consultaService.cancelarConsulta(this.consultaParaCancelar.id_consulta, { motivo_cancelamento: motivo })
      .subscribe({
        next: () => {
          alert('Consulta cancelada com sucesso.');
          this.listarConsultas();
          this.verificarReagendamento();
        },
        error: () => {
          alert('Erro ao cancelar consulta.');
        }
      });

    this.showModalCancelar = false;
    this.consultaParaCancelar = null;
  }

  enriquecerConsultasComNomes(consultas: any[]) {
    const requisicoesMedicos = consultas.map(c =>
      this.usuarioService.buscarPorId(c.id_medico)
    );
    const requisicoesUsuarios = consultas.map(c =>
      c.id_usuario ? this.usuarioService.buscarPorId(c.id_usuario) : null
    );
    const usuariosObservables = requisicoesUsuarios.map(req =>
      req ? req : Promise.resolve(null)
    );
    forkJoin([forkJoin(requisicoesMedicos), forkJoin(usuariosObservables)]).subscribe({
      next: ([medicos, usuarios]) => {
        this.consultas = consultas.map((consulta, index) => ({
          ...consulta,
          medico: medicos[index],
          usuario: usuarios[index]
        }));
        this.consultasFiltradas = [...this.consultas];
        this.aplicarFiltros();
      },
      error: err => console.error('Erro ao buscar médicos/usuários:', err)
    });
  }

  getStatusDescricao(status: number): string {
    switch (status) {
      case 0: return 'Não agendada';
      case 1: return 'Agendada';
      case 2: return 'Concluída';
      case 3: return 'Cancelada';
      default: return 'Desconhecida';
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

  aplicarFiltros(): void {
    this.loading = true;
    setTimeout(() => {
      const termoNome = this.nomeMedicoFiltro.toLowerCase().trim();
      const termoDescricao = this.descricaoFiltro.toLowerCase().trim();
      const termoEspecialidade = this.especializacaoSelecionada.toLowerCase().trim();
      const termoStatus = this.statusSelecionado;
      const dataInicio = this.dataInicio ? new Date(this.dataInicio) : null;
      const dataFim = this.dataFim ? new Date(this.dataFim) : null;

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
        const dataConsulta = new Date(c.data);
        const dataOk = (dataInicio ? dataConsulta >= dataInicio : true)
          && (dataFim ? dataConsulta <= dataFim : true);
        return nomeMedicoOk && descricaoOk && especialidadeOk && statusOk && dataOk;
      });
      this.loading = false;
    }, 600);
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