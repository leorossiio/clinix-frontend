import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UsuarioService } from '../../../features/usuarios/services/usuario.service';
import { ConsultaService } from '../../../features/consultas/services/consulta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-cadastro-consulta',
  templateUrl: './modal-cadastro-consulta.component.html',
  styleUrls: ['./modal-cadastro-consulta.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ModalCadastroConsultaComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() consultaCadastrada = new EventEmitter<any>(); // Novo nome para mais clareza

  medicos: any[] = [];
  filtroMedico: string = '';
  idMedicoSelecionado: string = '';
  nomeMedicoSelecionado: string = '';
  dataHoraConsulta: string = '';
  descricaoConsulta: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private consultaService: ConsultaService
  ) { }

  ngOnInit() {
    this.usuarioService.listarMedicos().subscribe((medicos: any[]) => {
      this.medicos = medicos;
    });
  }

  selecionarMedicoPorNome() {
    const selecionado = this.medicos.find(m => m.nome === this.nomeMedicoSelecionado);
    this.idMedicoSelecionado = selecionado ? selecionado.id_usuario : '';
  }
  
  medicosFiltrados() {
    const filtro = this.filtroMedico.toLowerCase();
    return this.medicos.filter(medico =>
      medico.nome.toLowerCase().includes(filtro)
    );
  }

  onSalvar() {
    const dados = {
      id_medico: this.idMedicoSelecionado,
      data: this.dataHoraConsulta,
      descricao: this.descricaoConsulta
    };

    this.consultaService.cadastrarConsulta(dados).subscribe({
      next: (res) => {
        this.consultaCadastrada.emit(res);
        this.resetarCampos();
        this.onClose(); // fecha o modal
      },
      error: (err) => {
        console.error('Erro ao cadastrar consulta:', err);
      }
    });
  }

  onClose() {
    this.close.emit();
    this.resetarCampos();
  }

  resetarCampos() {
    this.filtroMedico = '';
    this.idMedicoSelecionado = '';
    this.dataHoraConsulta = '';
    this.descricaoConsulta = '';
  }
}