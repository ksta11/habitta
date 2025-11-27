import { z } from 'zod';
import { textField } from '../utils/validation';

export const RegisterSchema = z.object({
  name: textField(2, 50, 'El nombre contiene caracteres no permitidos'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono debe contener solo números y caracteres válidos')
    .trim()
    .refine(
      (val) => {
        // Contar solo los dígitos numéricos (sin +, -, espacios, paréntesis)
        const digitsOnly = val.replace(/[^0-9]/g, '');
        return digitsOnly.length >= 10;
      },
      { message: 'El teléfono debe tener al menos 10 dígitos' }
    )
    .refine(
      (val) => {
        // Contar solo los dígitos numéricos (sin +, -, espacios, paréntesis)
        const digitsOnly = val.replace(/[^0-9]/g, '');
        return digitsOnly.length <= 15;
      },
      { message: 'El teléfono no puede tener más de 15 dígitos' }
    ),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Tipo inferido del schema (para el formulario, sin role)
export type RegisterFormData = z.infer<typeof RegisterSchema>;

// Función helper para validar y formatear errores
export const validateRegisterForm = (data: unknown) => {
  const result = RegisterSchema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: {}
    };
  }
  
  // Formatear errores para el formulario
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    errors[field] = issue.message;
  });
  
  return {
    success: false,
    data: null,
    errors
  };
};