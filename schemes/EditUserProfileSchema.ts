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
    .optional()
    .refine(
      (password) => {
        // Si la contraseña está vacía o es undefined, es válida (no se cambiará)
        if (!password || password.trim() === '') return true;
        
        // Si tiene contenido, debe cumplir con las validaciones
        return (
          password.length >= 8 &&
          password.length <= 100 &&
          /[A-Z]/.test(password) &&
          /[0-9]/.test(password)
        );
      },
      {
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número'
      }
    ),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono debe contener solo números y caracteres válidos')
    .optional(),
});

export type EditUserProfileDTO = z.infer<typeof editUserProfileSchema>;
