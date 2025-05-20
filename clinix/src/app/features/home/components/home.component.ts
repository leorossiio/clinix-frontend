import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ModalCadastroConsultaComponent } from '../../modais/modal-cadastro-consulta/modal-cadastro-consulta.component';
import { ModalAtualizacaoConsultaComponent } from '../../modais/modal-atualizacao-consulta/modal-atualizacao-consulta.component';
import { ConsultaService } from '../../consultas/services/consulta.service';
import { AuthService } from '../../usuarios/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    FormsModule,
    ModalCadastroConsultaComponent,
    ModalAtualizacaoConsultaComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  consultas: any[] = [];

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
      console.log('TOKEN ATUAL:', localStorage.getItem('token'));
    if (this.tipoUsuario === 1 || this.tipoUsuario === 2) {
      this.consultaService.listarConsultas().subscribe({
        next: res => this.consultas = res,
        error: err => console.error('Erro ao carregar consultas:', err)
      });
    } else if (this.tipoUsuario === 0) {
      this.consultaService.listarConsultasUsuario().subscribe({
        next: res => this.consultas = res,
        error: err => console.error('Erro ao carregar consultas do usuário:', err)
      });
    }
  }

  abrirModalCadastro() {
    this.modalCadastroAberto = true;
  }

  fecharModalCadastro() {
    this.modalCadastroAberto = false;
  }

  criarConsulta(dadosConsulta: any) {
    this.consultaService.cadastrarConsulta(dadosConsulta).subscribe({
      next: () => {
        this.fecharModalCadastro();
        this.listarConsultas();
      },
      error: err => console.error('Erro ao criar consulta:', err)
    });
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
    const confirmar = confirm(`Deseja excluir a consulta com ${consulta.medico || 'o médico selecionado'}?`);
    if (confirmar) {
      this.consultaService.cancelarConsulta(consulta.id_consulta).subscribe({
        next: () => this.listarConsultas(),
        error: err => console.error('Erro ao excluir consulta:', err)
      });
    }
  }
}