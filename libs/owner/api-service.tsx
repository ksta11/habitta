import AsyncStorage from '@react-native-async-storage/async-storage';
import { OwnerDashboard } from '../../interfaces/OwnerDashboardInterface';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Interface para respuesta de ingresos
export interface OwnerIncomeResponse {
	success: boolean;
	message?: string;
	data: Array<{ month: string; amount: number }>;
}

// Obtener estadísticas del propietario
export const getOwnerStats = async (): Promise<OwnerDashboard> => {
	try {
		console.log('📊 Iniciando obtención de estadísticas del propietario...');
		
		// Obtener datos del usuario desde AsyncStorage
		const userDataString = await AsyncStorage.getItem(USER_KEY);
		if (!userDataString) {
			console.log('❌ No se encontraron datos del usuario en AsyncStorage');
			return {
				success: false,
				message: 'Usuario no autenticado',
				data: {
					totalProperties: 0,
					pendingApplications: 0,
					scheduledMaintenances: 0,
					monthlyIncome: [],
					recentApplications: []
				}
			};
		}
		
		const userData = JSON.parse(userDataString);
		const ownerId = userData.id;
		console.log('� Owner ID:', ownerId);
		
		// Obtener token para la autorización
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ No se encontró token de autenticación');
			return {
				success: false,
				message: 'Token de autenticación no encontrado',
				data: {
					totalProperties: 0,
					pendingApplications: 0,
					scheduledMaintenances: 0,
					monthlyIncome: [],
					recentApplications: []
				}
			};
		}
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/stats/owner/${ownerId}`;
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
		console.log('📊 Respuesta completa:', data);
		
		if (!response.ok) {
			console.log('❌ Error en la respuesta:', data.message);
			return {
				success: false,
				message: data.message || 'Error al obtener estadísticas del propietario',
				data: {
					totalProperties: 0,
					pendingApplications: 0,
					scheduledMaintenances: 0,
					monthlyIncome: [],
					recentApplications: []
				}
			};
		}
		
		console.log('✅ Estadísticas obtenidas exitosamente');
		
		return {
			success: true,
			message: data.message || 'Estadísticas obtenidas exitosamente',
			data: data.data || {
				totalProperties: 0,
				pendingApplications: 0,
				scheduledMaintenances: 0,
				monthlyIncome: [],
				recentApplications: []
			}
		};
		
	} catch (error) {
		console.error('💥 Error crítico al obtener estadísticas del propietario:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Error de conexión',
			data: {
				totalProperties: 0,
				pendingApplications: 0,
				scheduledMaintenances: 0,
				recentApplications: []
			}
		};
	}
};

// Obtener estado del propietario
export interface OwnerStatusResponse {
	success: boolean;
	message?: string;
	data: {
		id: string;
		status: string;
		isVerifiedOrPending: boolean;
	} | null;
}

export const getOwnerStatus = async (): Promise<OwnerStatusResponse> => {
	try {
		console.log('🔎 Consultando estado del propietario...');

		// Obtener token y usuario desde AsyncStorage
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			console.log('❌ Token de autenticación no encontrado');
			return { success: false, message: 'Token de autenticación no encontrado', data: null };
		}

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/users/owners/status`;
		console.log('🌐 URL de consulta:', url);

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		console.log('📡 Status de respuesta:', response.status);
		const body = await response.json();
		console.log('📨 Respuesta:', body);

		if (!response.ok) {
			console.log('❌ Error en la respuesta:', body?.message);
			return { success: false, message: body?.message || 'Error al obtener el estado del propietario', data: null };
		}

		// Esperamos body.data con id, status e isVerifiedOrPending
		const payload = body?.data || null;

		return {
			success: true,
			message: body?.message || 'Estado obtenido correctamente',
			data: payload
				? {
						id: String(payload.id),
						status: String(payload.status),
						isVerifiedOrPending: Boolean(payload.isVerifiedOrPending),
					}
				: null,
		};
	} catch (error) {
		console.error('💥 Error al consultar estado del propietario:', error);
		return { success: false, message: error instanceof Error ? error.message : 'Error de conexión', data: null };
	}
};

// Obtener ingresos del propietario por período
export const getOwnerIncome = async (period: '3months' | '6months' | '1year' | 'all' = '6months'): Promise<OwnerIncomeResponse> => {
	try {
		console.log(`📊 Obteniendo ingresos del propietario para período: ${period}...`);
		
		// Obtener datos del usuario desde AsyncStorage
		const userDataString = await AsyncStorage.getItem(USER_KEY);
		if (!userDataString) {
			console.log('❌ No se encontraron datos del usuario en AsyncStorage');
			return {
				success: false,
				message: 'Usuario no autenticado',
				data: []
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
				message: 'Token de autenticación no encontrado',
				data: []
			};
		}
		
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/stats/income/${ownerId}?period=${period}`;
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
		console.log('💰 Respuesta de ingresos:', data);
		
		if (!response.ok) {
			console.log('❌ Error en la respuesta:', data.message);
			return {
				success: false,
				message: data.message || 'Error al obtener ingresos del propietario',
				data: []
			};
		}
		
		console.log('✅ Ingresos obtenidos exitosamente');
		
		return {
			success: true,
			message: data.message || 'Ingresos obtenidos exitosamente',
			data: data.data || []
		};
		
	} catch (error) {
		console.error('💥 Error crítico al obtener ingresos del propietario:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Error de conexión',
			data: []
		};
	}
};
