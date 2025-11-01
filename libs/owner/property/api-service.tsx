import { CreatePropertyDTO, PropertyImage, GetOwnerPropertiesResponse, GetAllPropertiesResponse, GetPropertyByIdResponse, UpdatePropertyDTO, UpdatePropertyResponse, DeletePropertyResponse, Plan, GetPlansResponse } from '../../../interfaces/property/PropertyInterface';
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
				// img ahora es un PropertyImage (objeto con url_image)
				const imageUrl = img.url_image;
				
				if (typeof imageUrl === 'string' && imageUrl.startsWith('file://')) {
					console.log('⏳ Subiendo imagen local:', imageUrl);
					const url = await uploadImageToCloudinary(imageUrl);
					if (url) {
						uploadedImages.push({ url_image: url });
						console.log('✅ Imagen subida exitosamente:', url);
					} else {
						console.log('❌ Error al subir imagen:', imageUrl);
					}
				} else if (typeof imageUrl === 'string') {
					// Si ya es una URL, solo agregarla
					uploadedImages.push({ url_image: imageUrl });
					console.log('🔗 URL existente agregada:', imageUrl);
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

// Actualizar propiedad
export const updateProperty = async (propertyId: string, propertyData: UpdatePropertyDTO): Promise<UpdatePropertyResponse> => {
	try {
		console.log('🏠 Iniciando actualización de propiedad:', propertyId);
		console.log('📋 Datos a actualizar:', propertyData);
		
		// Subir imágenes a Cloudinary si vienen como uri
		let uploadedImages: PropertyImage[] = [];
		if (propertyData.images && propertyData.images.length > 0) {
			console.log(`📸 Procesando ${propertyData.images.length} imágenes...`);
			
			for (const img of propertyData.images) {
				// img ahora es un PropertyImage (objeto con url_image)
				const imageUrl = img.url_image;
				
				if (typeof imageUrl === 'string' && imageUrl.startsWith('file://')) {
					console.log('⏳ Subiendo imagen local nueva:', imageUrl);
					const url = await uploadImageToCloudinary(imageUrl);
					if (url) {
						uploadedImages.push({ url_image: url });
						console.log('✅ Nueva imagen subida exitosamente:', url);
					} else {
						console.log('❌ Error al subir imagen:', imageUrl);
					}
				} else if (typeof imageUrl === 'string') {
					// Si ya es una URL (imagen existente), solo agregarla
					uploadedImages.push({ url_image: imageUrl });
					console.log('🔗 Imagen existente mantenida:', imageUrl);
				}
			}
			
			console.log(`🎉 Proceso de imágenes completado. Total: ${uploadedImages.length}`);
		}
		
		// Preparar datos para enviar al backend
		const propertyToUpdate = { 
			...propertyData, 
			images: uploadedImages
		};

		// Obtener token para la autorización
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ No se encontró token de autenticación');
			return {
				success: false,
				message: 'Token de autenticación no encontrado',
				statusCode: 401
			};
		}

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties/${propertyId}`;
		console.log('🌐 URL de actualización:', url);

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(propertyToUpdate),
		});

		console.log('📡 Status de respuesta:', response.status);
		
		const data = await response.json();
		console.log('📋 Respuesta del servidor:', data);

		if (!response.ok) {
			console.log('❌ Error en la actualización:', data.message);
			return {
				success: false,
				statusCode: response.status,
				message: data.message || 'Error al actualizar la propiedad',
			};
		}

		console.log('✅ Propiedad actualizada exitosamente:', data.data?.title || 'Sin título');

		return {
			success: true,
			statusCode: response.status,
			data: data.data,
			message: data.message || 'Propiedad actualizada exitosamente',
		};

	} catch (error) {
		console.error('💥 Error crítico al actualizar propiedad:', error);
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

// Obtener propiedad por ID
export const getPropertyById = async (propertyId: string): Promise<GetPropertyByIdResponse> => {
	try {
		console.log('🏠 Iniciando obtención de propiedad por ID:', propertyId);
		
		// Obtener token para la autorización
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ No se encontró token de autenticación');
			return {
				success: false,
				data: null,
				message: 'Token de autenticación no encontrado'
			};
		}
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties/${propertyId}`;
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
				data: null,
				message: data.message || 'Error al obtener la propiedad',
			};
		}
		
		console.log('✅ Propiedad obtenida exitosamente:', data.data?.title || 'Sin título');
		
		return {
			success: true,
			data: data.data || null,
			message: data.message || 'Propiedad obtenida exitosamente',
		};
		
	} catch (error) {
		console.error('💥 Error crítico al obtener propiedad:', error);
		return {
			success: false,
			data: null,
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

// Eliminar propiedad
export const deleteProperty = async (propertyId: string): Promise<DeletePropertyResponse> => {
	try {
		console.log('🗑️ Iniciando eliminación de propiedad:', propertyId);
		
		// Obtener token para la autorización
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ No se encontró token de autenticación');
			return {
				success: false,
				message: 'Token de autenticación no encontrado',
				statusCode: 401
			};
		}
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties/${propertyId}`;
		console.log('🌐 URL de eliminación:', url);
		
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});
		
		console.log('📡 Status de respuesta:', response.status);
		
		const data = await response.json();
		console.log('📋 Respuesta del servidor:', data);
		
		if (!response.ok) {
			console.log('❌ Error en la eliminación:', data.message);
			return {
				success: false,
				statusCode: response.status,
				message: data.message || 'Error al eliminar la propiedad',
			};
		}
		
		console.log('✅ Propiedad eliminada exitosamente');
		
		return {
			success: true,
			statusCode: response.status,
			message: data.message || 'Propiedad eliminada exitosamente',
		};
		
	} catch (error) {
		console.error('💥 Error crítico al eliminar propiedad:', error);
		return {
			success: false,
			statusCode: 500,
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

// Obtener todas las propiedades (para usuarios)
export const getAllProperties = async (): Promise<GetAllPropertiesResponse> => {
	try {
		console.log('🏠 Iniciando obtención de todas las propiedades...');
		
		// Obtener token para la autorización (opcional según tu backend)
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties`;
		console.log('🌐 URL de consulta:', url);
		
		// Headers con token si existe (algunos endpoints pueden no requerirlo)
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		const response = await fetch(url, {
			method: 'GET',
			headers,
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
		console.error('💥 Error crítico al obtener todas las propiedades:', error);
		return {
			success: false,
			data: [],
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

export const getAllPublishedProperties = async (): Promise<GetAllPropertiesResponse> => {
	try {
		console.log('🏠 Iniciando obtención de todas las propiedades disponibles...');
		
		// Obtener token para la autorización (opcional según tu backend)
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/properties`;
		console.log('🌐 URL de consulta:', url);
		
		// Headers con token si existe (algunos endpoints pueden no requerirlo)
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		const response = await fetch(url, {
			method: 'GET',
			headers,
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
		console.error('💥 Error crítico al obtener todas las propiedades:', error);
		return {
			success: false,
			data: [],
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

export const getPlans = async (): Promise<GetPlansResponse> => {
	try {
		console.log('📋 Iniciando obtención de planes...');
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/plans`;
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
		console.log('📋 Respuesta del servidor:', data);

		if (!response.ok) {
			console.log('❌ Error al obtener planes:', data.message);
			return {
				success: false,
				data: [],
				message: data.message || 'Error al obtener planes',
			};
		}

		console.log(`✅ Planes obtenidos exitosamente. Total: ${data.data ? data.data.length : 0}`);

		return {
			success: true,
			data: data.data || [],
			message: data.message || 'Planes obtenidos exitosamente',
		};

	} catch (error) {
		console.error('💥 Error crítico al obtener planes:', error);
		return {
			success: false,
			data: [],
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};