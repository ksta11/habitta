// __tests__/utils/validation.test.ts
import { TEXT_ALLOWED_REGEX, textField } from '../../utils/validation';

describe('TEXT_ALLOWED_REGEX', () => {
  it('debe aceptar texto simple en español', () => {
    expect(TEXT_ALLOWED_REGEX.test('Hola Mundo')).toBe(true);
  });

  it('debe aceptar texto con tildes', () => {
    expect(TEXT_ALLOWED_REGEX.test('José María')).toBe(true);
  });

  it('debe aceptar números', () => {
    expect(TEXT_ALLOWED_REGEX.test('Casa 123')).toBe(true);
  });

  it('debe aceptar caracteres especiales permitidos', () => {
    expect(TEXT_ALLOWED_REGEX.test('¿Cómo estás? ¡Bien!')).toBe(true);
  });

  it('debe rechazar emojis', () => {
    expect(TEXT_ALLOWED_REGEX.test('Hola 😊')).toBe(false);
  });

  it('debe aceptar direcciones', () => {
    expect(TEXT_ALLOWED_REGEX.test('Calle 123 #45-67')).toBe(true);
  });
});

describe('textField', () => {
  it('debe validar campo con longitud mínima', () => {
    const schema = textField(3);
    expect(schema.safeParse('Hola').success).toBe(true);
    expect(schema.safeParse('Ho').success).toBe(false);
  });

  it('debe validar campo con longitud máxima', () => {
    const schema = textField(1, 10);
    expect(schema.safeParse('Corto').success).toBe(true);
    expect(schema.safeParse('Este texto es muy largo').success).toBe(false);
  });

  it('debe remover espacios al inicio y final', () => {
    const schema = textField();
    const result = schema.parse('  Hola  ');
    expect(result).toBe('Hola');
  });

  it('debe rechazar caracteres no permitidos', () => {
    const schema = textField();
    expect(schema.safeParse('Texto con emoji 😊').success).toBe(false);
  });
});
