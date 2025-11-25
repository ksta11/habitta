// __tests__/utils/format.test.ts
import { formatCurrency, formatPlanPrice } from '../../utils/format';

describe('formatCurrency', () => {
  it('debe formatear números como moneda colombiana por defecto', () => {
    const formatted = formatCurrency(1500000);
    expect(formatted).toContain('1');
    expect(formatted).toContain('500');
    expect(formatted).toContain('000');
  });

  it('debe manejar cero correctamente', () => {
    const formatted = formatCurrency(0);
    expect(formatted).toBeTruthy();
  });

  it('debe permitir especificar locale y moneda', () => {
    const formatted = formatCurrency(1000, 'USD', 'en-US');
    expect(formatted).toContain('1');
    expect(formatted).toContain('000');
  });

  it('debe manejar valores negativos', () => {
    const formatted = formatCurrency(-500000);
    expect(formatted).toContain('500');
  });

  it('debe manejar valores muy grandes', () => {
    const formatted = formatCurrency(999999999);
    expect(formatted).toBeTruthy();
  });

  it('debe manejar valores decimales', () => {
    const formatted = formatCurrency(1234.56);
    expect(formatted).toBeTruthy();
  });
});

describe('formatPlanPrice', () => {
  it('debe formatear "Gratis" para precio 0', () => {
    expect(formatPlanPrice(0)).toBe('Gratis');
    expect(formatPlanPrice(null)).toBe('Gratis');
    expect(formatPlanPrice(undefined)).toBe('Gratis');
  });

  it('debe formatear porcentajes para valores entre 0 y 1', () => {
    expect(formatPlanPrice(0.05)).toBe('5%/renta');
    expect(formatPlanPrice(0.1)).toBe('10%/renta');
    expect(formatPlanPrice(0.075)).toBe('7.5%/renta');
  });

  it('debe formatear precios fijos para valores >= 1', () => {
    expect(formatPlanPrice(100)).toBe('$100');
    expect(formatPlanPrice(99.99)).toBe('$99.99');
    expect(formatPlanPrice(1)).toBe('$1');
  });
});
