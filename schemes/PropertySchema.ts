import { z } from 'zod';

export const PropertySchema = z.object({
  title: z.string().min(3, 'El título es requerido'),
  description: z.string().min(5, 'La descripción es requerida'),
  address: z.string().min(5, 'La dirección es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  price: z.number().min(1, 'El precio es requerido'),
  type: z.enum(['house', 'apartament', 'store', 'office', 'werehouse'], {
    message: 'Selecciona un tipo válido'
  }),
  rooms: z.number().min(0, 'Las habitaciones son requeridas'),
  bathrooms: z.number().min(0, 'Los baños son requeridos'),
  area: z.number().min(1, 'El área es requerida'),
  services: z.string().min(2, 'Los servicios son requeridos'),
  images: z.array(z.string().url('URL de imagen inválida')).min(1, 'Agrega al menos una imagen'),
});

// Schema para CREAR propiedades (sin publication_status)
export const CreatePropertySchema = PropertySchema;

// Schema para EDITAR propiedades (con publication_status)
export const EditPropertySchema = PropertySchema.extend({
  publication_status: z.enum(['published', 'rented', 'disabled'], {
    message: 'Selecciona un estado válido'
  }),
});

// Tipos
export type CreatePropertyFormType = z.infer<typeof CreatePropertySchema>;
export type EditPropertyFormType = z.infer<typeof EditPropertySchema>;