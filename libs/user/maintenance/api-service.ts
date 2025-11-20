import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CreateMaintenanceRequestDTO,
  CreateMaintenanceRequestResponse,
  DeleteMaintenanceRequestResponse,
  GetMaintenanceRequestsResponse,
  UpdateMaintenanceRequestDTO,
  UpdateMaintenanceRequestResponse
} from '../../../interfaces/MaintenanceInterface';

const TOKEN_KEY = '@habitta_token';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Obtiene el token de autenticación del AsyncStorage
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('❌ Error al obtener token:', error);
    return null;
  }
};

/**
 * Obtiene todas las solicitudes de mantenimiento del usuario autenticado
 */
export const getMaintenanceRequests = async (): Promise<GetMaintenanceRequestsResponse> => {
  try {
    console.log('🔧 Obteniendo solicitudes de mantenimiento del usuario...');
    
    const token = await getAuthToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Intentar primero con /my (endpoint para usuarios)
    const url = `${API_BASE_URL}/api/maintenances/my`;
    console.log('🌐 URL completa (intentando /my):', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ Respuesta de error del backend:', JSON.stringify(data, null, 2));
      throw new Error(data.message || 'Error al obtener solicitudes de mantenimiento');
    }

    console.log('✅ Solicitudes obtenidas:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener solicitudes de mantenimiento:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene las solicitudes de mantenimiento de un arrendamiento específico
 * TODO: Implementar endpoint en backend - Por ahora usa getMaintenanceRequests()
 */
export const getLeaseMaintenanceRequests = async (leaseId: string): Promise<GetMaintenanceRequestsResponse> => {
  try {
    console.log('🔧 [MOCK] Obteniendo solicitudes de mantenimiento del arrendamiento:', leaseId);
    
    // Por ahora retorna las mismas solicitudes mock que getMaintenanceRequests
    return await getMaintenanceRequests();
  } catch (error) {
    console.error('❌ Error al obtener solicitudes de mantenimiento:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Crea una nueva solicitud de mantenimiento
 */
export const createMaintenanceRequest = async (
  requestData: CreateMaintenanceRequestDTO
): Promise<CreateMaintenanceRequestResponse> => {
  try {
    console.log('🔧 Creando solicitud de mantenimiento...');
    console.log('📋 Datos:', requestData);
    
    const token = await getAuthToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_BASE_URL}/api/maintenances`;
    console.log('🌐 URL completa:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    
    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Respuesta de error del backend:', JSON.stringify(data, null, 2));
      if (data.errors) {
        console.log('📋 Errores de validación Zod:', JSON.stringify(data.errors, null, 2));
      }
      throw new Error(data.message || 'Error al crear solicitud de mantenimiento');
    }

    console.log('✅ Solicitud de mantenimiento creada:', data.data.id_maintenance);
    
    return data;
  } catch (error) {
    console.error('❌ Error al crear solicitud de mantenimiento:', error);
    return {
      success: false,
      data: {} as any,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Actualiza una solicitud de mantenimiento existente
 */
export const updateMaintenanceRequest = async (
  requestId: string,
  updateData: UpdateMaintenanceRequestDTO
): Promise<UpdateMaintenanceRequestResponse> => {
  try {
    console.log('🔧 Actualizando solicitud de mantenimiento:', requestId);
    console.log('📋 Datos:', updateData);
    
    const token = await getAuthToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_BASE_URL}/api/maintenances/${requestId}`;
    console.log('🌐 URL completa:', url);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    
    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar solicitud de mantenimiento');
    }

    console.log('✅ Solicitud actualizada:', data.data.id_maintenance);
    
    return data;
  } catch (error) {
    console.error('❌ Error al actualizar solicitud de mantenimiento:', error);
    return {
      success: false,
      data: {} as any,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Confirma una solicitud de mantenimiento (Paso 4)
 */
export const confirmMaintenanceRequest = async (requestId: string): Promise<UpdateMaintenanceRequestResponse> => {
  return updateMaintenanceRequest(requestId, { status: 'confirmed' });
};

/**
 * Cancela una solicitud de mantenimiento
 */
export const cancelMaintenanceRequest = async (requestId: string): Promise<UpdateMaintenanceRequestResponse> => {
  return updateMaintenanceRequest(requestId, { status: 'cancelled' });
};

/**
 * Elimina una solicitud de mantenimiento
 * TODO: Implementar endpoint en backend - Por ahora retorna éxito mockeado
 */
export const deleteMaintenanceRequest = async (requestId: string): Promise<DeleteMaintenanceRequestResponse> => {
  try {
    console.log('🔧 [MOCK] Eliminando solicitud de mantenimiento:', requestId);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('✅ [MOCK] Solicitud eliminada');
    
    return {
      success: true,
      message: 'Solicitud eliminada exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al eliminar solicitud de mantenimiento:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};
