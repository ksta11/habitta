import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sube un archivo a Supabase Storage y retorna la URL pública
 * @param bucket Nombre del bucket
 * @param filePath Ruta/nombre del archivo (ejemplo: "docs/mipdf.pdf")
 * @param file Blob del archivo
 * @returns URL pública del archivo subido
 */
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: Blob
): Promise<string> => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};
