import { StatusUsuario, TipoUsuario, Usuario } from '../core/modelos/usuario';

const base64url = (texto: string) =>
  btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** JWT de teste (assinatura falsa) que expira daqui a `segundos`. */
export function tokenQueExpiraEm(
  segundos: number,
  tipo: TipoUsuario = TipoUsuario.PACIENTE,
): string {
  const exp = Math.floor(Date.now() / 1000) + segundos;
  const payload = JSON.stringify({ sub: 'u1', tipo, exp });
  return `${base64url('{"alg":"HS256"}')}.${base64url(payload)}.x`;
}

export function umUsuario(dados: Partial<Usuario> = {}): Usuario {
  return {
    id_usuario: 'u1',
    nome: 'Paula Paciente',
    email: 'paula@clinix.dev',
    tipo_usuario: TipoUsuario.PACIENTE,
    status: StatusUsuario.ATIVO,
    especialidade: null,
    crm: null,
    ...dados,
  };
}
