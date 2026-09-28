import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de grupo: exige que os controles `senha` e `confirmacao` sejam
 * iguais. Só acusa erro depois que a confirmação foi digitada.
 */
export const senhasIguais: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value;
  const confirmacao = grupo.get('confirmacao')?.value;
  return confirmacao && senha !== confirmacao ? { senhasDiferentes: true } : null;
};
