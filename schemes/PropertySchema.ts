import { z } from 'zod';
import { textField } from '../utils/validation';

// Schema para PropertyImage
const PropertyImageSchema = z.object({
  url_image: z.string().url('URL de imagen inválida')
});

export const PropertySchema = z.object({
  title: textField(3, 120, 'El título contiene caracteres no permitidos'),
  description: textField(5, 2000, 'La descripción contiene caracteres no permitidos'),
  address: textField(5, 200, 'La dirección contiene caracteres no permitidos'),
  city: textField(2, 100, 'La ciudad contiene caracteres no permitidos'),
  price: z.number().min(1, 'El precio es requerido'),
  type: z.enum(['house', 'apartament', 'store', 'office', 'werehouse'], {
    message: 'Selecciona un tipo válido'
  }),
  rooms: z.number().min(0, 'Las habitaciones son requeridas'),
  bathrooms: z.number().min(0, 'Los baños son requeridos'),
  area: z.number().min(1, 'El área es requerida'),
  services: textField(2, 2000, 'Los servicios contienen caracteres no permitidos'),
  images: z.array(PropertyImageSchema).min(1, 'Agrega al menos una imagen'),
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