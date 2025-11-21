import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetOwnerMaintenanceRequestByIdResponse,
  GetOwnerMaintenanceRequestsResponse,
  OwnerMaintenanceRequest,
  OwnerUpdateMaintenanceRequestDTO,
  UpdateOwnerMaintenanceRequestResponse
} from '../../../interfaces/owner/OwnerMaintenanceInterface';

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
 * Obtiene todas las solicitudes de mantenimiento de las propiedades del owner
 */
export const getOwnerMaintenanceRequests = async (): Promise<GetOwnerMaintenanceRequestsResponse> => {
  try {
    console.log('🏠 Obteniendo solicitudes de mantenimiento del owner...');
    
    const token = await getAuthToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_BASE_URL}/api/maintenances/my-owner`;
    console.log('🌐 URL completa:', url);

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
      throw new Error(data.message || 'Error al obtener solicitudes de mantenimiento');
    }

    console.log('✅ Solicitudes del owner obtenidas:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Error al obtener solicitudes de mantenimiento del owner:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene las solicitudes de mantenimiento de una propiedad específica
 */
export const getPropertyMaintenanceRequests = async (propertyId: string): Promise<GetOwnerMaintenanceRequestsResponse> => {
  try {
    console.log('🏠 Obteniendo solicitudes de propiedad:', propertyId);
    
    const allRequests = await getOwnerMaintenanceRequests();
    
    if (!allRequests.success) {
      return allRequests;
    }
    
    const filteredRequests = allRequests.data.filter(
      request => request.id_property === propertyId
    );
    
    console.log('✅ Solicitudes de propiedad filtradas:', filteredRequests.length);
    
    return {
      success: true,
      data: filteredRequests,
      message: 'Solicitudes obtenidas exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener solicitudes de propiedad:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene una solicitud de mantenimiento por ID
 */
export const getOwnerMaintenanceRequestById = async (
  requestId: string
): Promise<GetOwnerMaintenanceRequestByIdResponse> => {
  try {
    console.log('🏠 Obteniendo solicitud por ID:', requestId);
    
    const allRequests = await getOwnerMaintenanceRequests();
    
    if (!allRequests.success) {
      return {
        success: false,
        data: null,
        message: allRequests.message
      };
    }
    
    const request = allRequests.data.find(req => req.id_maintenance === requestId);
    
    if (!request) {
      console.log('❌ Solicitud no encontrada');
      return {
        success: false,
        data: null,
        message: 'Solicitud no encontrada'
      };
    }
    
    console.log('✅ Solicitud encontrada');
    
    return {
      success: true,
      data: request,
      message: 'Solicitud obtenida exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener solicitud:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Actualiza una solicitud de mantenimiento
 */
export const updateOwnerMaintenanceRequest = async (
  requestId: string,
  updateData: OwnerUpdateMaintenanceRequestDTO
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  try {
    console.log('🏠 Actualizando solicitud:', requestId);
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
    console.error('❌ Error al actualizar solicitud:', error);
    return {
      success: false,
      data: {} as any,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Crea una nueva solicitud de mantenimiento como owner (Escenario 2)
 * NOTA: scheduled_date es OBLIGATORIO cuando el owner crea el mantenimiento
 */
export const createOwnerMaintenanceRequest = async (requestData: {
  id_property: string;
  id_owner: string;
  id_user: string;
  title: string;
  description: string;
  responsibility: 'owner' | 'user';
  scheduled_date: string; // OBLIGATORIO para escenario 2
  cost_estimate?: number;
}): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  try {
    console.log('🏠 Creando solicitud de mantenimiento como owner...');
    console.log('📋 Datos:', requestData);
    
    const token = await getAuthToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const url = `${API_BASE_URL}/api/maintenances`;
    console.log('🌐 URL completa:', url);

    // El backend requiere estos campos para escenario 2 (owner-initiated)
    const payload = {
      id_property: requestData.id_property,
      id_owner: requestData.id_owner,
      id_user: requestData.id_user,
      title: requestData.title,
      description: requestData.description,
      responsibility: requestData.responsibility,
      scheduled_date: requestData.scheduled_date, // OBLIGATORIO
      cost_estimate: requestData.cost_estimate,
      created_by: 'owner', // Indica que el owner crea la solicitud
    };

    console.log('📤 Payload:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error en respuesta:', data);
      throw new Error(data.message || 'Error al crear solicitud de mantenimiento');
    }

    console.log('✅ Solicitud creada:', data.data?.id_maintenance);
    
    return data;
  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    return {
      success: false,
      data: {} as any,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Funciones helper para acciones específicas del owner
 */

// Aceptar y programar solicitud (Paso 3)
export const acceptAndScheduleMaintenanceRequest = async (
  requestId: string,
  scheduledDate: string,
  estimatedCost?: number
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'accepted',
    scheduled_date: scheduledDate,
    cost_estimate: estimatedCost,
  });
};

// Aprobar solicitud (legacy - ahora usa accepted)
export const approveMaintenanceRequest = async (
  requestId: string,
  estimatedCost?: number,
  scheduledDate?: string,
  notes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'accepted',
    cost_estimate: estimatedCost,
    scheduled_date: scheduledDate,
  });
};

// Rechazar solicitud
export const rejectMaintenanceRequest = async (
  requestId: string,
  notes: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'rejected',
  });
};

// Marcar como en revisión
export const reviewMaintenanceRequest = async (
  requestId: string,
  notes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'in_review',
  });
};

// Programar trabajo
export const scheduleMaintenanceWork = async (
  requestId: string,
  scheduledDate: string,
  estimatedCost?: number,
  notes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'in_progress',
    scheduled_date: scheduledDate,
    cost_estimate: estimatedCost,
  });
};

// Completar trabajo (Paso 5)
export const completeMaintenanceWork = async (
  requestId: string,
  actualCost?: number,
  notes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  const updateData: OwnerUpdateMaintenanceRequestDTO = {
    status: 'completed',
  };
  
  // Agregar costo final si se proporciona
  if (actualCost !== undefined) {
    updateData.cost_estimate = actualCost;
  }
  
  return updateOwnerMaintenanceRequest(requestId, updateData);
};
