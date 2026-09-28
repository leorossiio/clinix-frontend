import { FormControl, FormGroup } from '@angular/forms';
import { senhasIguais } from './senhas-iguais.validator';

describe('senhasIguais', () => {
  const grupo = (senha: string, confirmacao: string) =>
    new FormGroup(
      { senha: new FormControl(senha), confirmacao: new FormControl(confirmacao) },
      { validators: senhasIguais },
    );

  it('aceita senhas iguais', () => {
    expect(grupo('abc123', 'abc123').valid).toBeTrue();
  });

  it('acusa senhas diferentes', () => {
    expect(grupo('abc123', 'abc124').hasError('senhasDiferentes')).toBeTrue();
  });

  it('não acusa diferença enquanto a confirmação está vazia', () => {
    expect(grupo('abc123', '').hasError('senhasDiferentes')).toBeFalse();
  });
});
