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
 * Obtiene todas las solicitudes de mantenimiento de las propiedades del owner
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getOwnerMaintenanceRequests = async (): Promise<GetOwnerMaintenanceRequestsResponse> => {
  try {
    console.log('🏠 [MOCK] Obteniendo solicitudes de mantenimiento del owner...');
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos mockeados con información del inquilino y propiedad
    const mockRequests: OwnerMaintenanceRequest[] = [
      {
        id: 'owner-maint-1',
        id_lease: 'lease-123',
        id_property: 'prop-123',
        id_renter: 'renter-123',
        id_owner: 'owner-123',
        title: 'Fuga en el baño principal',
        category: 'plumbing',
        priority: 'high',
        status: 'pending',
        description: 'Hay una fuga de agua en el lavabo del baño principal que necesita atención urgente.',
        request_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
        images: [],
        renter: {
          id: 'renter-123',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          phone: '+52 55 1234 5678'
        },
        property: {
          id: 'prop-123',
          title: 'Departamento en Polanco',
          address: 'Calle Masaryk 123, Polanco, CDMX',
          images: [{ url_image: 'https://via.placeholder.com/400x300' }]
        }
      },
      {
        id: 'owner-maint-2',
        id_lease: 'lease-124',
        id_property: 'prop-124',
        id_renter: 'renter-124',
        id_owner: 'owner-123',
        title: 'Aire acondicionado no enfría',
        category: 'heating',
        priority: 'medium',
        status: 'in_review',
        description: 'El aire acondicionado de la sala no está enfriando adecuadamente.',
        request_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
        images: [],
        owner_notes: 'Revisando disponibilidad del técnico',
        estimated_cost: 2500,
        renter: {
          id: 'renter-124',
          name: 'María González',
          email: 'maria.gonzalez@example.com',
          phone: '+52 55 9876 5432'
        },
        property: {
          id: 'prop-124',
          title: 'Casa en Condesa',
          address: 'Av. Amsterdam 456, Condesa, CDMX',
          images: [{ url_image: 'https://via.placeholder.com/400x300' }]
        }
      },
      {
        id: 'owner-maint-3',
        id_lease: 'lease-125',
        id_property: 'prop-123',
        id_renter: 'renter-123',
        id_owner: 'owner-123',
        title: 'Puerta principal no cierra bien',
        category: 'structural',
        priority: 'medium',
        status: 'approved',
        description: 'La puerta principal tiene problemas con la cerradura y no cierra correctamente.',
        request_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Mañana
        images: [],
        owner_notes: 'Cerrajero programado para mañana a las 10:00 AM',
        estimated_cost: 1500,
        renter: {
          id: 'renter-123',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          phone: '+52 55 1234 5678'
        },
        property: {
          id: 'prop-123',
          title: 'Departamento en Polanco',
          address: 'Calle Masaryk 123, Polanco, CDMX',
          images: [{ url_image: 'https://via.placeholder.com/400x300' }]
        }
      },
      {
        id: 'owner-maint-4',
        id_lease: 'lease-126',
        id_property: 'prop-125',
        id_renter: 'renter-125',
        id_owner: 'owner-123',
        title: 'Lavadora no funciona',
        category: 'appliances',
        priority: 'low',
        status: 'in_progress',
        description: 'La lavadora no enciende. Parece ser un problema eléctrico.',
        request_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        owner_notes: 'Técnico en camino',
        estimated_cost: 3000,
        renter: {
          id: 'renter-125',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@example.com',
          phone: '+52 55 5555 1234'
        },
        property: {
          id: 'prop-125',
          title: 'Departamento en Roma Norte',
          address: 'Calle Orizaba 789, Roma Norte, CDMX',
          images: [{ url_image: 'https://via.placeholder.com/400x300' }]
        }
      },
      {
        id: 'owner-maint-5',
        id_lease: 'lease-124',
        id_property: 'prop-124',
        id_renter: 'renter-124',
        id_owner: 'owner-123',
        title: 'Luz de la cocina parpadeando',
        category: 'electrical',
        priority: 'low',
        status: 'completed',
        description: 'La luz del techo de la cocina parpadea constantemente.',
        request_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        scheduled_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        completion_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        owner_notes: 'Se reemplazó el balastro. Problema resuelto.',
        estimated_cost: 1500,
        actual_cost: 1200,
        renter_rating: 5,
        renter_review: 'Servicio excelente, muy rápido.',
        renter: {
          id: 'renter-124',
          name: 'María González',
          email: 'maria.gonzalez@example.com',
          phone: '+52 55 9876 5432'
        },
        property: {
          id: 'prop-124',
          title: 'Casa en Condesa',
          address: 'Av. Amsterdam 456, Condesa, CDMX',
          images: [{ url_image: 'https://via.placeholder.com/400x300' }]
        }
      },
    ];

    console.log('✅ [MOCK] Solicitudes del owner obtenidas:', mockRequests.length);
    
    return {
      success: true,
      data: mockRequests,
      message: 'Solicitudes obtenidas exitosamente'
    };
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
 * TODO: Implementar endpoint en backend
 */
export const getPropertyMaintenanceRequests = async (propertyId: string): Promise<GetOwnerMaintenanceRequestsResponse> => {
  try {
    console.log('🏠 [MOCK] Obteniendo solicitudes de propiedad:', propertyId);
    
    // Obtener todas y filtrar por propiedad
    const allRequests = await getOwnerMaintenanceRequests();
    
    if (!allRequests.success) {
      return allRequests;
    }
    
    const filteredRequests = allRequests.data.filter(
      request => request.id_property === propertyId
    );
    
    console.log('✅ [MOCK] Solicitudes de propiedad filtradas:', filteredRequests.length);
    
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
 * TODO: Implementar endpoint en backend
 */
export const getOwnerMaintenanceRequestById = async (
  requestId: string
): Promise<GetOwnerMaintenanceRequestByIdResponse> => {
  try {
    console.log('🏠 [MOCK] Obteniendo solicitud por ID:', requestId);
    
    // Obtener todas y buscar por ID
    const allRequests = await getOwnerMaintenanceRequests();
    
    if (!allRequests.success) {
      return {
        success: false,
        data: null,
        message: allRequests.message
      };
    }
    
    const request = allRequests.data.find(req => req.id === requestId);
    
    if (!request) {
      console.log('❌ Solicitud no encontrada');
      return {
        success: false,
        data: null,
        message: 'Solicitud no encontrada'
      };
    }
    
    console.log('✅ [MOCK] Solicitud encontrada');
    
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
 * Actualiza una solicitud de mantenimiento (aprobar, rechazar, programar, completar)
 * TODO: Implementar endpoint en backend
 */
export const updateOwnerMaintenanceRequest = async (
  requestId: string,
  updateData: OwnerUpdateMaintenanceRequestDTO
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  try {
    console.log('🏠 [MOCK] Actualizando solicitud:', requestId);
    console.log('📋 Datos:', updateData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Obtener la solicitud actual
    const currentRequest = await getOwnerMaintenanceRequestById(requestId);
    
    if (!currentRequest.success || !currentRequest.data) {
      return {
        success: false,
        data: {} as any,
        message: 'Solicitud no encontrada'
      };
    }

    // Simular actualización
    const updatedRequest: OwnerMaintenanceRequest = {
      ...currentRequest.data,
      ...updateData,
    };

    console.log('✅ [MOCK] Solicitud actualizada');
    
    return {
      success: true,
      data: updatedRequest,
      message: 'Solicitud actualizada exitosamente'
    };
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
 * Funciones helper para acciones específicas del owner
 */

// Aprobar solicitud
export const approveMaintenanceRequest = async (
  requestId: string,
  estimatedCost?: number,
  scheduledDate?: string,
  ownerNotes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'approved',
    estimated_cost: estimatedCost,
    scheduled_date: scheduledDate,
    owner_notes: ownerNotes,
  });
};

// Rechazar solicitud
export const rejectMaintenanceRequest = async (
  requestId: string,
  ownerNotes: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'rejected',
    owner_notes: ownerNotes,
  });
};

// Marcar como en revisión
export const reviewMaintenanceRequest = async (
  requestId: string,
  ownerNotes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'in_review',
    owner_notes: ownerNotes,
  });
};

// Programar trabajo
export const scheduleMaintenanceWork = async (
  requestId: string,
  scheduledDate: string,
  estimatedCost?: number,
  ownerNotes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'in_progress',
    scheduled_date: scheduledDate,
    estimated_cost: estimatedCost,
    owner_notes: ownerNotes,
  });
};

// Completar trabajo
export const completeMaintenanceWork = async (
  requestId: string,
  actualCost: number,
  ownerNotes?: string
): Promise<UpdateOwnerMaintenanceRequestResponse> => {
  return updateOwnerMaintenanceRequest(requestId, {
    status: 'completed',
    completion_date: new Date().toISOString(),
    actual_cost: actualCost,
    owner_notes: ownerNotes,
  });
};
