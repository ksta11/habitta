import * as z from 'zod';

export const VerifyIdentitySchema = z.object({
  documentType: z.enum(['CC', 'CE', 'PP', 'PEP', 'PPT', 'NIT'], {
    errorMap: () => ({ message: 'Selecciona un tipo de documento válido' })
  }),
  documentNumber: z.string().min(1, 'El número de documento es requerido').min(4, 'Número demasiado corto').max(20, 'Número demasiado largo'),
  files: z.array(
    z.object({
      uri: z.string(),
      name: z.string(),
      size: z.number().optional(),
      mimeType: z.string().optional(),
    })
  ).min(1, 'Debes subir un archivo con el documento escaneado').max(3).refine((arr) => {
    // Validar que exista al menos un PDF (mimeType o name)
    return arr.some(f => {
      const name = f.name || '';
      const mime = f.mimeType || '';
      return mime.toLowerCase() === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
    });
  }, { message: 'Se requiere al menos un archivo PDF' })
});

export type VerifyIdentityForm = z.infer<typeof VerifyIdentitySchema>;
