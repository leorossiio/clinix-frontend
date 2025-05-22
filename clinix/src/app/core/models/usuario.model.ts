export interface Usuario {
  id_usuario?: string;
  nome: string;
  email: string;
  senha?: string;
  tipo_usuario: number;
  status: number;
  crm?: string;
  especialidade?: string;
}