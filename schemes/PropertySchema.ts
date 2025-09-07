import { z } from 'zod';

export const PropertySchema = z.object({
  title: z.string().min(3, 'El título es requerido'),
  description: z.string().min(5, 'La descripción es requerida'),
  address: z.string().min(5, 'La dirección es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  price: z.number().min(1, 'El precio es requerido'),
  type: z.string().min(2, 'El tipo es requerido'),
  rooms: z.number().min(0, 'Las habitaciones son requeridas'),
  bathrooms: z.number().min(0, 'Los baños son requeridos'),
  area: z.number().min(1, 'El área es requerida'),
  services: z.string().min(2, 'Los servicios son requeridos'),
  images: z.array(z.string().url('URL de imagen inválida')).min(1, 'Agrega al menos una imagen'),
});

export type PropertyFormType = z.infer<typeof PropertySchema>;
