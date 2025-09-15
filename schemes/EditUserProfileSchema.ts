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
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono debe contener solo números y caracteres válidos')
    .optional(),
});

export type EditUserProfileDTO = z.infer<typeof editUserProfileSchema>;
