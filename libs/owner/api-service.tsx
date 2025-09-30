import { OwnerDashboard } from '../../interfaces/OwnerDashboardInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

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
				monthlyIncome: [],
				recentApplications: []
			}
		};
	}
};
