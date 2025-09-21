import { GetOwnerApplicationsResponse, UpdateApplicationStatusDTO, UpdateApplicationStatusResponse } from '../../../interfaces/application/ApplicationInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Obtener aplicaciones del propietario
export const getOwnerApplications = async (): Promise<GetOwnerApplicationsResponse> => {
	try {
		console.log('📋 Iniciando obtención de aplicaciones del propietario...');
		
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
		const url = `${API_BASE_URL}/api/applications/my-owner`;
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
				message: data.message || 'Error al obtener aplicaciones',
			};
		}
		
		console.log(`✅ Aplicaciones obtenidas exitosamente. Total: ${data.data ? data.data.length : 0}`);
		
		return {
			success: true,
			data: data.data || [],
			message: data.message || 'Aplicaciones obtenidas exitosamente',
		};
		
	} catch (error) {
		console.error('💥 Error crítico al obtener aplicaciones:', error);
		return {
			success: false,
			data: [],
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};

// Actualizar estado de aplicación
export const updateApplicationStatus = async (applicationId: string, statusData: UpdateApplicationStatusDTO): Promise<UpdateApplicationStatusResponse> => {
	try {
		console.log('🔄 Iniciando actualización de estado de aplicación:', applicationId);
		console.log('📋 Nuevo estado:', statusData);
		
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
		const url = `${API_BASE_URL}/api/applications/${applicationId}`;
		console.log('🌐 URL de actualización:', url);
		
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(statusData),
		});
		
		console.log('📡 Status de respuesta:', response.status);
		
		const data = await response.json();
		console.log('📋 Respuesta del servidor:', data);
		
		if (!response.ok) {
			console.log('❌ Error en la actualización:', data.message);
			return {
				success: false,
				statusCode: response.status,
				message: data.message || 'Error al actualizar el estado de la aplicación',
			};
		}
		
		console.log('✅ Estado de aplicación actualizado exitosamente');
		
		return {
			success: true,
			statusCode: response.status,
			data: data.data,
			message: data.message || 'Estado actualizado exitosamente',
		};
		
	} catch (error) {
		console.error('💥 Error crítico al actualizar estado de aplicación:', error);
		return {
			success: false,
			statusCode: 500,
			message: error instanceof Error ? error.message : 'Error de conexión',
		};
	}
};