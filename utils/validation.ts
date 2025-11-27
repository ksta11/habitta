import { z } from 'zod';

// 🔒 LÍMITES MÁXIMOS PARA PREVENCIÓN DE BUFFER OVERFLOW
export const MAX_LENGTHS = {
  NAME: 100,
  EMAIL: 100,
  PHONE: 20,
  SEARCH: 150,        // Para búsquedas
  TITLE: 150,
  ADDRESS: 200,
  DESCRIPTION: 1000,
  COMMENT: 500,
  MESSAGE: 2000,
  LONG_TEXT: 5000,
  PRICE: 15,
  PASSWORD: 100,
  URL: 500,
} as const;

// 🛡️ DETECCIÓN DE INYECCIÓN SQL
const SQL_INJECTION_REGEX = /((\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bUNION\b|\bEXEC\b|\bEXECUTE\b)[\s\S]*(\bFROM\b|\bWHERE\b|\bINTO\b|\bVALUES\b|\bTABLE\b)|(\bOR\b|\bAND\b)\s*['"]?\d+['"]?\s*=\s*['"]?\d+['"]?|--|\/\*|\*\/|;[\s]*\bDROP\b|<script|javascript:|onerror=|onload=)/gi;

// 🛡️ DETECCIÓN DE CARACTERES PELIGROSOS
const DANGEROUS_CHARS_REGEX = /[;<>{}[\]\\`|]/;

// Regex to allow Unicode letters, numbers, common punctuation and whitespace.
// This excludes emojis and many uncommon symbols/control characters.
// Allows: letters (including accents), numbers, spaces, basic punctuation: . , ' " ( ) - # @ : & / % ? ! ¡ ¿
export const TEXT_ALLOWED_REGEX = /^[\p{L}\p{N}\s.,'"()#@:&\/ %?!¡¿-]+$/u;

export const TEXT_ALLOWED_ERROR = 'El campo contiene caracteres no permitidos';

// 🔒 FUNCIONES DE SEGURIDAD
/**
 * Detecta patrones de inyección SQL en el input
 */
export const detectSQLInjection = (input: string): boolean => {
  return SQL_INJECTION_REGEX.test(input);
};

/**
 * Detecta caracteres peligrosos
 */
export const hasDangerousChars = (input: string): boolean => {
  return DANGEROUS_CHARS_REGEX.test(input);
};

/**
 * Sanitiza el input removiendo caracteres peligrosos y limitando longitud
 */
export const sanitizeInput = (input: string, maxLength: number = MAX_LENGTHS.LONG_TEXT): string => {
  // Remover caracteres peligrosos
  let sanitized = input.replace(DANGEROUS_CHARS_REGEX, '');
  
  // Normalizar espacios múltiples
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Limitar longitud
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Helper to create a zod string schema with common text validations
export const textField = (minLen = 1, maxLen = 255, message?: string) =>
  z.string()
    .min(minLen, `Debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `No puede exceder ${maxLen} caracteres`)
    .regex(TEXT_ALLOWED_REGEX, message || TEXT_ALLOWED_ERROR)
    .trim();

/**
 * 🔒 Validador seguro para campos de búsqueda
 * Protege contra SQL injection, caracteres peligrosos y buffer overflow
 * Permite strings vacíos para permitir borrar la búsqueda
 */
export const secureSearchField = (maxLen = MAX_LENGTHS.SEARCH) =>
  z.string()
    .max(maxLen, `La búsqueda no puede exceder ${maxLen} caracteres`)
    .trim()
    .refine(
      (val) => val === '' || !detectSQLInjection(val),  // ✅ Permite vacío
      { message: 'Se detectó un patrón de seguridad no permitido' }
    )
    .refine(
      (val) => val === '' || !hasDangerousChars(val),  // ✅ Permite vacío
      { message: 'El campo contiene caracteres no permitidos' }
    )
    .transform((val) => val === '' ? '' : sanitizeInput(val, maxLen));  // ✅ No sanitiza vacío

/**
 * 🔒 Validador seguro para campos de texto con protección completa
 */
export const secureTextField = (minLen = 1, maxLen = 255, customMessage?: string) =>
  z.string()
    .min(minLen, `Debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `No puede exceder ${maxLen} caracteres`)
    .trim()
    .refine(
      (val) => !detectSQLInjection(val),
      { message: 'Se detectó un patrón de seguridad no permitido' }
    )
    .refine(
      (val) => !hasDangerousChars(val),
      { message: customMessage || 'El campo contiene caracteres no permitidos' }
    )
    .refine(
      (val) => TEXT_ALLOWED_REGEX.test(val),
      { message: customMessage || TEXT_ALLOWED_ERROR }
    )
    .transform((val) => sanitizeInput(val, maxLen));

export default {
  TEXT_ALLOWED_REGEX,
  TEXT_ALLOWED_ERROR,
  textField,
  secureSearchField,
  secureTextField,
  MAX_LENGTHS,
  detectSQLInjection,
  hasDangerousChars,
  sanitizeInput,
};
