import { z } from 'zod';

// Regex to allow Unicode letters, numbers, common punctuation and whitespace.
// This excludes emojis and many uncommon symbols/control characters.
// Allows: letters (including accents), numbers, spaces, basic punctuation: . , ' " ( ) - # @ : & / % ? ! ¡ ¿
export const TEXT_ALLOWED_REGEX = /^[\p{L}\p{N}\s.,'"()#@:&\/ %?!¡¿-]+$/u;

export const TEXT_ALLOWED_ERROR = 'El campo contiene caracteres no permitidos';

// Helper to create a zod string schema with common text validations
export const textField = (minLen = 1, maxLen = 255, message?: string) =>
  z.string()
    .min(minLen, `Debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `No puede exceder ${maxLen} caracteres`)
    .regex(TEXT_ALLOWED_REGEX, message || TEXT_ALLOWED_ERROR)
    .trim();

export default {
  TEXT_ALLOWED_REGEX,
  TEXT_ALLOWED_ERROR,
  textField,
};
