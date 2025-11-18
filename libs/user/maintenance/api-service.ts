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
 * Obtiene todas las solicitudes de mantenimiento del usuario autenticado
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getMaintenanceRequests = async (): Promise<GetMaintenanceRequestsResponse> => {
  try {
    console.log('🔧 [MOCK] Obteniendo solicitudes de mantenimiento...');
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos mockeados con categorías válidas
    const mockRequests = [
      {
        id: 'maint-1',
        id_lease: 'lease-123',
        id_property: 'prop-123',
        id_renter: 'renter-123',
        id_owner: 'owner-123',
        title: 'Fuga en el baño principal',
        category: 'plumbing' as const,
        priority: 'high' as const,
        status: 'in_progress' as const,
        description: 'Hay una fuga de agua en el lavabo del baño principal que necesita atención urgente.',
        request_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        owner_notes: 'El plomero visitará mañana a las 10:00 AM',
      },
      {
        id: 'maint-2',
        id_lease: 'lease-123',
        id_property: 'prop-123',
        id_renter: 'renter-123',
        id_owner: 'owner-123',
        title: 'Aire acondicionado no enfría',
        category: 'heating' as const, // Corregido de 'hvac' a 'heating'
        priority: 'medium' as const,
        status: 'pending' as const,
        description: 'El aire acondicionado de la sala no está enfriando adecuadamente.',
        request_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
      },
      {
        id: 'maint-3',
        id_lease: 'lease-123',
        id_property: 'prop-123',
        id_renter: 'renter-123',
        id_owner: 'owner-123',
        title: 'Luz de la cocina parpadeando',
        category: 'electrical' as const,
        priority: 'low' as const,
        status: 'completed' as const,
        description: 'La luz del techo de la cocina parpadea constantemente.',
        request_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        completion_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        owner_notes: 'Se reemplazó el balastro. Problema resuelto.',
        estimated_cost: 1500,
        actual_cost: 1200,
      },
    ];

    console.log('✅ [MOCK] Solicitudes obtenidas:', mockRequests.length);
    
    return {
      success: true,
      data: mockRequests as any,
      message: 'Solicitudes obtenidas exitosamente'
    };
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
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const createMaintenanceRequest = async (
  requestData: CreateMaintenanceRequestDTO
): Promise<CreateMaintenanceRequestResponse> => {
  try {
    console.log('🔧 [MOCK] Creando solicitud de mantenimiento...');
    console.log('📋 Datos:', requestData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Crear solicitud mock
    const newRequest = {
      id: `maint-${Date.now()}`,
      ...requestData,
      status: 'pending' as const,
      request_date: new Date().toISOString(),
      images: [],
    };

    console.log('✅ [MOCK] Solicitud de mantenimiento creada');
    
    return {
      success: true,
      data: newRequest as any,
      message: 'Solicitud creada exitosamente'
    };
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
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const updateMaintenanceRequest = async (
  requestId: string,
  updateData: UpdateMaintenanceRequestDTO
): Promise<UpdateMaintenanceRequestResponse> => {
  try {
    console.log('🔧 [MOCK] Actualizando solicitud de mantenimiento:', requestId);
    console.log('📋 Datos:', updateData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Retornar solicitud actualizada mock
    const updatedRequest = {
      id: requestId,
      ...updateData,
      request_date: new Date().toISOString(),
    };

    console.log('✅ [MOCK] Solicitud actualizada');
    
    return {
      success: true,
      data: updatedRequest as any,
      message: 'Solicitud actualizada exitosamente'
    };
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
