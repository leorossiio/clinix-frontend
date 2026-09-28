import { lerPayloadDoToken } from './jwt';

/** Monta um JWT (sem assinatura válida) com o payload informado, em base64url. */
function tokenCom(payload: object): string {
  const base64url = (texto: string) =>
    btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url('{"alg":"HS256"}')}.${base64url(JSON.stringify(payload))}.assinatura`;
}

describe('lerPayloadDoToken', () => {
  it('lê o id, o perfil e a expiração', () => {
    expect(lerPayloadDoToken(tokenCom({ sub: 'u1', tipo: 1, exp: 123 }))).toEqual({
      sub: 'u1',
      tipo: 1,
      exp: 123,
    });
  });

  it('decodifica base64url com "-" e "_" (que o atob puro não aceita)', () => {
    // "~~~" e "???" geram "+" e "/" em base64, que viram "-" e "_" em base64url.
    const token = tokenCom({ sub: '~~~???', tipo: 0 });

    expect(lerPayloadDoToken(token)?.sub).toBe('~~~???');
  });

  it('decodifica caracteres acentuados', () => {
    const utf8 = String.fromCharCode(...new TextEncoder().encode('{"sub":"João"}'));
    const token = `x.${btoa(utf8).replace(/=+$/, '')}.y`;

    expect(lerPayloadDoToken(token)?.sub).toBe('João');
  });

  it('devolve null para tokens malformados', () => {
    expect(lerPayloadDoToken('nao-e-um-jwt')).toBeNull();
    expect(lerPayloadDoToken('a.###.c')).toBeNull();
  });
});
