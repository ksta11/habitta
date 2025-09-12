import { z } from 'zod';

// Schema de validación para Login (simplificado como tu ejemplo)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Tipo inferido del schema (compatible con tu LoginDTO)
export type LoginDTO = z.infer<typeof loginSchema>;