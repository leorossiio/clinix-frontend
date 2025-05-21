    export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: 0 | 1 | 2;   
  status: 0 | 1;             
  especialidade: number | null;
  crm: string | null;
}
