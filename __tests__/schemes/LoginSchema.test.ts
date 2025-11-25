// __tests__/schemes/LoginSchema.test.ts
import { loginSchema } from '../../schemes/LoginSchema';

describe('loginSchema', () => {
  it('debe validar email y password correctos', () => {
    const data = {
      email: 'test@example.com',
      password: 'password123'
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('debe rechazar email vacío', () => {
    const data = {
      email: '',
      password: 'password123'
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('debe rechazar email inválido', () => {
    const data = {
      email: 'invalid-email',
      password: 'password123'
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('debe rechazar password vacío', () => {
    const data = {
      email: 'test@example.com',
      password: ''
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('debe rechazar password menor a 6 caracteres', () => {
    const data = {
      email: 'test@example.com',
      password: '12345'
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('debe aceptar password de exactamente 6 caracteres', () => {
    const data = {
      email: 'test@example.com',
      password: '123456'
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
