import { z } from 'zod';

export const editUserProfileSchema = z.object({
  name: z
  .string()
  .min(1, 'El nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede exceder 50 caracteres')
  .trim().optional(),
  email: z
  .string()
  .min(1, 'El email es requerido')
  .email('Por favor ingresa un email válido')
  .toLowerCase()
  .trim().optional(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número').optional(),
  dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida').optional(),
  country: z.string().min(1, 'El país es requerido').optional(),
});

export type EditUserProfileDTO = z.infer<typeof editUserProfileSchema>;
