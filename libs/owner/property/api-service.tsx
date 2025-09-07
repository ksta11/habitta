import { CreatePropertyDTO, PropertyImage, GetOwnerPropertiesResponse } from '../../../interfaces/PropertyInterface';
import { uploadImageToCloudinary } from '../../cloudinary/api-service';
import { useAuth } from '../../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Crear propiedad


const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

export const createProperty = async (propertyData: CreatePropertyDTO) => {
	try {
		// Subir imágenes a Cloudinary si vienen como uri
		let uploadedImages: PropertyImage[] = [];
		if (propertyData.images && propertyData.images.length > 0) {
			console.log(`📸 Iniciando subida de ${propertyData.images.length} imágenes...`);
			
			for (const img of propertyData.images) {
				// img ahora es un string (uri local o url remota)
				if (typeof img === 'string' && img.startsWith('file://')) {
					console.log('⏳ Subiendo imagen local:', img);
					const url = await uploadImageToCloudinary(img);
					if (url) {
						uploadedImages.push({ url_image: url });
						console.log('✅ Imagen subida exitosamente:', url);
					} else {
						console.log('❌ Error al subir imagen:', img);
					}
				} else if (typeof img === 'string') {
					// Si ya es una URL, solo agregarla
					uploadedImages.push({ url_image: img });
					console.log('🔗 URL existente agregada:', img);
				}
			}
			
			console.log(`🎉 Proceso de subida completado. Total de imágenes procesadas: ${uploadedImages.length}`);
			console.log('📋 URLs finales:', uploadedImages.map(img => img.url_image));
		}
		// Reemplazar las imágenes en propertyData por las subidas
		const propertyToSend = { ...propertyData, images: uploadedImages};

		const token = await AsyncStorage.getItem(TOKEN_KEY)

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const response = await fetch(`${API_BASE_URL}/api/properties`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(propertyToSend),
		});
		const data = await response.json();
		if (!response.ok) {
			return {
				success: false,
				statusCode: response.status,
				message: data.message || 'Error al crear propiedad',
			};
		}
		return {
			success: true,
			statusCode: response.status,
			data,
			message: data.message || 'Propiedad creada exitosamente',
		};
	} catch (error) {
		return {
			success: false,
			statusCode: 500,
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

// Obtener propiedades del owner
export const getOwnerProperties = async (): Promise<GetOwnerPropertiesResponse> => {
	try {
		console.log('🏠 Iniciando obtención de propiedades del owner...');
		
		// Obtener datos del usuario desde AsyncStorage
		const userDataString = await AsyncStorage.getItem(USER_KEY);
		if (!userDataString) {
			console.log('❌ No se encontraron datos del usuario en AsyncStorage');
			return {
				success: false,
				data: [],
				message: 'Usuario no autenticado'
			};
		}
		
		const userData = JSON.parse(userDataString);
		const ownerId = userData.id;
		console.log('👤 Owner ID:', ownerId);
		
		// Obtener token para la autorización
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ No se encontró token de autenticación');
			return {
				success: false,
				data: [],
				message: 'Token de autenticación no encontrado'
			};
		}
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties/owner/${ownerId}`;
		console.log('🌐 URL de consulta:', url);
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});
		
		console.log('📡 Status de respuesta:', response.status);
		
		const data = await response.json();
		console.log('📋 Respuesta completa:', data);
		
		if (!response.ok) {
			console.log('❌ Error en la respuesta:', data.message);
			return {
				success: false,
				data: [],
				message: data.message || 'Error al obtener propiedades',
			};
		}
		
		console.log(`✅ Propiedades obtenidas exitosamente. Total: ${data.data ? data.data.length : 0}`);
		
		return {
			success: true,
			data: data.data || [],
			message: data.message || 'Propiedades obtenidas exitosamente',
		};
		
	} catch (error) {
		console.error('💥 Error crítico al obtener propiedades:', error);
		return {
			success: false,
			data: [],
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};
