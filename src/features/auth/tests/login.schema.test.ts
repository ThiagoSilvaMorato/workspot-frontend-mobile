import { loginSchema } from '../schemas/login.schema';

describe('loginSchema', () => {
  it('valida credenciais corretas', () => {
    const result = loginSchema.safeParse({
      email: 'teste@example.com',
      password: 'senha123',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita email vazio', () => {
    const result = loginSchema.safeParse({ email: '', password: 'senha123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email é obrigatório');
    }
  });

  it('rejeita email inválido', () => {
    const result = loginSchema.safeParse({ email: 'nao-e-email', password: 'senha123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Digite um email válido');
    }
  });

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({ email: 'teste@example.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Senha é obrigatória');
    }
  });

  it('rejeita quando ambos os campos estão vazios', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
    }
  });
});
