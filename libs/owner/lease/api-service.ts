import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetOwnerLeaseByIdResponse,
  GetOwnerLeaseDocumentsResponse,
  GetOwnerLeasePaymentHistoryResponse,
  GetOwnerLeasesResponse,
  OwnerLease
} from '../../../interfaces/owner/OwnerLeaseInterface';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Obtiene todos los arrendamientos de las propiedades del owner
 * 1. Obtiene las propiedades del owner
 * 2. Para cada propiedad con status='rented', obtiene su application signed
 * Similar a getActiveLease() de user, pero retorna TODAS las applications signed del owner
 */
export const getOwnerLeases = async (): Promise<GetOwnerLeasesResponse> => {
  try {
    console.log('🏠 Obteniendo arrendamientos del owner...'); 
    
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
    
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return {
        success: false,
        data: [],
        message: 'Token de autenticación no encontrado'
      };
    }

    // 1. Obtener las propiedades del owner
    const propertiesUrl = `${API_BASE_URL}/api/properties/owner/${ownerId}`;
    console.log('🌐 URL de propiedades:', propertiesUrl);

    const propertiesResponse = await fetch(propertiesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!propertiesResponse.ok) {
      console.log('❌ Error al obtener propiedades:', propertiesResponse.status);
      return {
        success: false,
        data: [],
        message: 'Error al obtener propiedades del owner'
      };
    }

    const propertiesData = await propertiesResponse.json();
    console.log('📋 Propiedades obtenidas:', propertiesData.data?.length || 0);

    // 2. Filtrar solo las propiedades con status 'rented' (tienen arrendamiento activo)
    const rentedProperties = propertiesData.data?.filter((prop: any) => 
      prop.publication_status === 'rented'
    ) || [];

    console.log(`🏘️ Propiedades rentadas: ${rentedProperties.length}`);

    if (rentedProperties.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No tienes propiedades rentadas actualmente'
      };
    }

    // 3. Para cada propiedad rentada, obtener su application signed
    const ownerLeases: OwnerLease[] = [];

    for (const property of rentedProperties) {
      try {
        // Obtener applications de esta propiedad específica
        const applicationsUrl = `${API_BASE_URL}/api/applications/property/${property.id}`;
        console.log('📄 Obteniendo applications de propiedad:', property.id);

        const appResponse = await fetch(applicationsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!appResponse.ok) {
          console.log('⚠️ Error al obtener applications de propiedad:', property.id);
          continue; // Continuar con la siguiente propiedad
        }

        const appData = await appResponse.json();
        
        // Buscar la application con status 'signed'
        const signedApp = appData.data?.find((app: any) => app.status === 'signed');

        if (signedApp) {
          // Calcular end_date: 12 meses desde la fecha de firma
          const startDate = new Date(signedApp.application_date);
          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1); // +1 año

          const lease: OwnerLease = {
            id: signedApp.id,
            id_renter: signedApp.id_renter,
            id_property: property.id,
            id_owner: ownerId,
            start_date: signedApp.application_date,
            end_date: endDate.toISOString(),
            monthly_rent: property.price,
            deposit: property.price, // Típicamente 1 mes de renta
            status: 'active',
            payment_day: 1, // Día 1 de cada mes por defecto
            contract_url: '',
            created_at: signedApp.application_date,
            
            // Información del inquilino
            renter: {
              id: signedApp.id_renter,
              name: signedApp.renter?.name || 'Inquilino',
              email: signedApp.renter?.email || '',
              phone: signedApp.renter?.phone || ''
            },
            
            // Información de la propiedad
            property: {
              id: property.id,
              title: property.title,
              address: property.address,
              city: property.city || '',
              type: property.type || '',
              rooms: property.rooms || 0,
              bathrooms: property.bathrooms || 0,
              area: property.area || 0,
              images: property.images || []
            },

            // Estadísticas (TODO: Obtener del backend cuando estén disponibles)
            payments_on_time: 0,
            payments_late: 0,
            last_payment_date: '',
            maintenance_requests_count: 0,
            pending_maintenance_count: 0
          };

          ownerLeases.push(lease);
          console.log('✅ Lease encontrado para propiedad:', property.title);
        }
      } catch (error) {
        console.error('❌ Error al procesar propiedad:', property.id, error);
        // Continuar con la siguiente propiedad
      }
    }

    console.log(`✅ Total de arrendamientos activos: ${ownerLeases.length}`);

    return {
      success: true,
      data: ownerLeases,
      message: `${ownerLeases.length} arrendamiento${ownerLeases.length !== 1 ? 's' : ''} activo${ownerLeases.length !== 1 ? 's' : ''}`
    };
  } catch (error) {
    console.error('❌ Error al obtener arrendamientos del owner:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene un lease específico por ID
 * TODO: Implementar endpoint en backend
 */
export const getOwnerLeaseById = async (leaseId: string): Promise<GetOwnerLeaseByIdResponse> => {
  try {
    console.log('🏠 [MOCK] Obteniendo lease por ID:', leaseId);
    
    const allLeases = await getOwnerLeases();
    
    if (!allLeases.success) {
      return {
        success: false,
        data: null,
        message: allLeases.message
      };
    }
    
    const lease = allLeases.data.find(l => l.id === leaseId);
    
    if (!lease) {
      return {
        success: false,
        data: null,
        message: 'Arrendamiento no encontrado'
      };
    }
    
    console.log('✅ [MOCK] Lease encontrado');
    
    return {
      success: true,
      data: lease,
      message: 'Arrendamiento obtenido exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener lease:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene los documentos de un lease
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getOwnerLeaseDocuments = async (leaseId: string): Promise<GetOwnerLeaseDocumentsResponse> => {
  try {
    console.log('📄 [MOCK] Obteniendo documentos del lease:', leaseId);
    
    await new Promise(resolve => setTimeout(resolve, 400));

    const mockDocuments = [
      {
        id: `doc-${leaseId}-1`,
        id_lease: leaseId,
        type: 'contract' as const,
        name: 'Contrato de Arrendamiento.pdf',
        url: 'https://example.com/contract.pdf',
        upload_date: new Date().toISOString(),
      },
      {
        id: `doc-${leaseId}-2`,
        id_lease: leaseId,
        type: 'inventory' as const,
        name: 'Inventario de Inmueble.pdf',
        url: 'https://example.com/inventory.pdf',
        upload_date: new Date().toISOString(),
      },
    ];

    console.log('✅ [MOCK] Documentos obtenidos:', mockDocuments.length);
    
    return {
      success: true,
      data: mockDocuments,
      message: 'Documentos obtenidos exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene el historial de pagos de un lease
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getOwnerLeasePaymentHistory = async (leaseId: string): Promise<GetOwnerLeasePaymentHistoryResponse> => {
  try {
    console.log('💰 [MOCK] Obteniendo historial de pagos del lease:', leaseId);
    
    await new Promise(resolve => setTimeout(resolve, 400));

    // Generar historial de pagos de los últimos 6 meses
    const now = new Date();
    const mockPayments: any[] = [];
    
    for (let i = 0; i < 6; i++) {
      const paymentDate = new Date(now.getFullYear(), now.getMonth() - i, 5);
      const dueDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      let status: 'paid' | 'pending' | 'late' | 'cancelled';
      if (i === 0) status = 'pending';
      else if (i === 1) status = 'late';
      else status = 'paid';

      mockPayments.push({
        id: `payment-${leaseId}-${i}`,
        id_lease: leaseId,
        amount: 15000,
        payment_date: status === 'paid' ? paymentDate.toISOString() : '',
        due_date: dueDate.toISOString(),
        status,
        payment_method: status === 'paid' ? 'transfer' : undefined,
        receipt_url: status === 'paid' ? 'https://example.com/receipt.pdf' : undefined,
      });
    }

    console.log('✅ [MOCK] Historial de pagos obtenido:', mockPayments.length);
    
    return {
      success: true,
      data: mockPayments,
      message: 'Historial de pagos obtenido exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener historial de pagos:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene los leases que están por expirar (próximos 60 días)
 */
export const getExpiringLeases = async (): Promise<GetOwnerLeasesResponse> => {
  try {
    const allLeases = await getOwnerLeases();
    
    if (!allLeases.success) {
      return allLeases;
    }
    
    const now = new Date();
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    
    const expiringLeases = allLeases.data.filter(lease => {
      const endDate = new Date(lease.end_date);
      return endDate <= sixtyDaysFromNow && endDate >= now && lease.status === 'active';
    });
    
    return {
      success: true,
      data: expiringLeases,
      message: `${expiringLeases.length} arrendamientos próximos a expirar`
    };
  } catch (error) {
    console.error('❌ Error al obtener leases por expirar:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};
