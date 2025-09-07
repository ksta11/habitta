export const uploadImageToCloudinary = async (uri: string): Promise<string | null> => {
    try {
        console.log('☁️ Cloudinary: Iniciando subida de imagen');
        console.log('📂 URI de origen:', uri);
        
        const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
        
        // Verificar variables de entorno
        if (!uploadPreset) {
            console.error('❌ EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET no está configurado');
            return null;
        }
        if (!cloudName) {
            console.error('❌ EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME no está configurado');
            return null;
        }
        
        console.log('🔧 Upload Preset:', uploadPreset);
        console.log('🌥️ Cloud Name:', cloudName);

        const data = new FormData();
        data.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
        } as any);
        data.append('upload_preset', uploadPreset);

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        console.log('🌐 URL de destino:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: data,
        });

        console.log('📡 Status de respuesta:', response.status);
        console.log('📊 Headers de respuesta:', response.headers);

        const result = await response.json();
        console.log('📋 Respuesta completa de Cloudinary:', result);

        if (response.ok && result.secure_url) {
            console.log('✅ Imagen subida exitosamente a Cloudinary:', result.secure_url);
            return result.secure_url;
        } else {
            console.error('❌ Error en respuesta de Cloudinary:');
            console.error('- Status:', response.status);
            console.error('- Error:', result.error || result);
            return null;
        }
    } catch (error) {
        console.error('💥 Error crítico al subir imagen a Cloudinary:', error);
        if (error instanceof Error) {
            console.error('- Message:', error.message);
            console.error('- Stack:', error.stack);
        }
        return null;
    }
};