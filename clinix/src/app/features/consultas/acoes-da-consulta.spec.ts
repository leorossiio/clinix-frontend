import { StatusConsulta } from '../../core/modelos/consulta';
import { TipoUsuario } from '../../core/modelos/usuario';
import { umaConsulta } from '../../testing/fabricas';
import { acoesDaConsulta } from './acoes-da-consulta';

describe('acoesDaConsulta', () => {
  const agora = new Date('2026-10-01T12:00:00.000Z');
  const emHoras = (horas: number) => new Date(agora.getTime() + horas * 3_600_000).toISOString();
  const paciente = { id: 'p1', tipo: TipoUsuario.PACIENTE };
  const medico = { id: 'medico-1', tipo: TipoUsuario.MEDICO };
  const admin = { id: 'a1', tipo: TipoUsuario.ADMIN };

  describe('para o paciente', () => {
    it('pode agendar um horário disponível no futuro', () => {
      const acoes = acoesDaConsulta(umaConsulta({ data: emHoras(5) }), paciente, agora);

      expect(acoes.agendar).toBeTrue();
      expect(acoes.editar).toBeFalse();
    });

    it('não pode agendar horário que já passou', () => {
      expect(
        acoesDaConsulta(umaConsulta({ data: emHoras(-1) }), paciente, agora).agendar,
      ).toBeFalse();
    });

    it('pode cancelar a própria consulta com 24h ou mais de antecedência', () => {
      const consulta = umaConsulta({
        status: StatusConsulta.AGENDADA,
        id_paciente: 'p1',
        data: emHoras(24),
      });

      expect(acoesDaConsulta(consulta, paciente, agora).cancelar).toBeTrue();
    });

    it('com menos de 24h, não cancela e recebe a explicação', () => {
      const consulta = umaConsulta({
        status: StatusConsulta.AGENDADA,
        id_paciente: 'p1',
        data: emHoras(23),
      });
      const acoes = acoesDaConsulta(consulta, paciente, agora);

      expect(acoes.cancelar).toBeFalse();
      expect(acoes.aviso).toContain('24 horas');
    });

    it('pode reagendar quando a API indica que é possível', () => {
      const consulta = umaConsulta({
        status: StatusConsulta.CANCELADA,
        id_paciente: 'p1',
        reagendavel: true,
      });

      expect(acoesDaConsulta(consulta, paciente, agora).reagendar).toBeTrue();
    });
  });

  describe('para a clínica', () => {
    it('o médico edita e remove consultas ativas da própria agenda', () => {
      const acoes = acoesDaConsulta(
        umaConsulta({ status: StatusConsulta.AGENDADA }),
        medico,
        agora,
      );

      expect(acoes.editar).toBeTrue();
      expect(acoes.remover).toBeTrue();
      expect(acoes.agendar).toBeFalse();
    });

    it('o médico não mexe na agenda de outro médico', () => {
      const consulta = umaConsulta({ id_medico: 'outro' });

      expect(acoesDaConsulta(consulta, medico, agora).editar).toBeFalse();
    });

    it('o admin gerencia qualquer agenda, mas não consultas encerradas', () => {
      expect(acoesDaConsulta(umaConsulta({ id_medico: 'outro' }), admin, agora).remover).toBeTrue();
      expect(
        acoesDaConsulta(umaConsulta({ status: StatusConsulta.CANCELADA }), admin, agora).editar,
      ).toBeFalse();
    });
  });
});
