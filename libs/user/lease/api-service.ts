import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetActiveLeaseResponse,
  GetLatestPaymentResponse,
  GetLeaseDocumentsResponse,
  GetLeasePaymentHistoryResponse,
  Lease
} from '../../../interfaces/LeaseInterface';

const TOKEN_KEY = '@habitta_token';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Obtiene el arrendamiento activo del usuario autenticado
 * Busca en applications la que tenga status = 'signed'
 */
export const getActiveLease = async (): Promise<GetActiveLeaseResponse> => {
  try {
    console.log('📋 Obteniendo arrendamiento activo (application signed)...');
    
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return {
        success: false,
        data: null,
        message: 'Token de autenticación no encontrado'
      };
    }

    // Obtener todas las applications del usuario
    const url = `${API_BASE_URL}/api/applications/my`;
    console.log('🌐 URL de consulta:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();
    console.log('📋 Respuesta del servidor:', data);

    if (!response.ok) {
      console.log('❌ Error en la respuesta del servidor:', response.status);
      return {
        success: false,
        data: null,
        message: data.message || 'Error al obtener aplicaciones'
      };
    }

    // Buscar la application con status 'signed' (arrendamiento activo)
    const signedApplication = data.data?.find((app: any) => app.status === 'signed');

    if (!signedApplication) {
      console.log('ℹ️ No se encontró arrendamiento activo (signed)');
      return {
        success: true,
        data: null,
        message: 'No tienes un arrendamiento activo'
      };
    }

    console.log('✅ Arrendamiento activo encontrado:', signedApplication.id);

    // Calcular end_date: 12 meses desde la fecha de firma
    const startDate = new Date(signedApplication.application_date);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // +1 año

    // Obtener id_owner de la propiedad
    const ownerId = signedApplication.property?.id_owner;
    
    if (!ownerId) {
      console.error('❌ ERROR: No se encontró id_owner en la propiedad');
      console.log('📋 Property data:', JSON.stringify(signedApplication.property, null, 2));
      return {
        success: false,
        data: null,
        message: 'No se pudo obtener el id del propietario'
      };
    }
    
    console.log('✅ Owner ID obtenido:', ownerId);

    // Transformar la application a formato Lease
    const lease: Lease = {
      id: signedApplication.id,
      id_renter: signedApplication.id_renter,
      id_property: signedApplication.id_property,
      id_owner: ownerId || '', // Usar el id del owner
      start_date: signedApplication.application_date, // Fecha de firma del contrato
      end_date: endDate.toISOString(), // 12 meses después
      monthly_rent: signedApplication.rentAmount || signedApplication.property.price,
      deposit: signedApplication.rentAmount || signedApplication.property.price, // Típicamente 1 mes de renta
      status: 'active',
      payment_day: 1, // Día 1 de cada mes por defecto
      contract_url: '', // Se agregará cuando esté disponible
      created_at: signedApplication.application_date,
      property: {
        id: signedApplication.property.id,
        title: signedApplication.property.title,
        address: signedApplication.property.address,
        city: '', // Agregar si está disponible en el backend
        type: '', // Agregar si está disponible en el backend
        rooms: 0, // Agregar si está disponible en el backend
        bathrooms: 0, // Agregar si está disponible en el backend
        area: 0, // Agregar si está disponible en el backend
        images: signedApplication.property.images || []
      },
      owner: {
        id: signedApplication.property.owner.id,
        name: signedApplication.property.owner.name,
        phone: signedApplication.property.owner.phone,
        email: '' // Agregar si está disponible en el backend
      }
    };

    return {
      success: true,
      data: lease,
      message: 'Arrendamiento activo obtenido exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al obtener arrendamiento activo:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};

/**
 * Obtiene los documentos asociados a un arrendamiento
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getLeaseDocuments = async (leaseId: string): Promise<GetLeaseDocumentsResponse> => {
  try {
    console.log('📄 [MOCK] Obteniendo documentos del arrendamiento:', leaseId);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos mockeados para visualización
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
 * Obtiene el historial de pagos de un arrendamiento
 * TODO: Implementar endpoint en backend - Por ahora retorna datos mockeados
 */
export const getLeasePaymentHistory = async (leaseId: string): Promise<GetLeasePaymentHistoryResponse> => {
  try {
    console.log('💰 [MOCK] Obteniendo historial de pagos del arrendamiento:', leaseId);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generar historial de pagos de los últimos 6 meses
    const now = new Date();
    const mockPayments: any[] = [];
    
    for (let i = 0; i < 6; i++) {
      const paymentDate = new Date(now.getFullYear(), now.getMonth() - i, 5);
      const dueDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Los primeros 4 pagados, los últimos 2 uno pendiente y uno late
      let status: 'paid' | 'pending' | 'late' | 'cancelled';
      if (i === 0) status = 'pending'; // Mes actual pendiente
      else if (i === 1) status = 'late'; // Mes anterior atrasado
      else status = 'paid'; // Anteriores pagados

      mockPayments.push({
        id: `payment-${leaseId}-${i}`,
        id_lease: leaseId,
        amount: 15000, // Mismo monto del contrato
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
 * Obtiene el último pago de una aplicación
 */
export const getLatestPayment = async (applicationId: string): Promise<GetLatestPaymentResponse> => {
  try {
    console.log('💰 Obteniendo último pago de aplicación:', applicationId);
    
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return {
        success: false,
        data: null,
        message: 'Token de autenticación no encontrado'
      };
    }

    const url = `${API_BASE_URL}/api/payments/application/${applicationId}/latest`;
    console.log('🌐 URL de consulta:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();
    console.log('📋 Respuesta del servidor:', data);

    if (!response.ok) {
      console.log('❌ Error en la respuesta del servidor:', response.status);
      return {
        success: false,
        data: null,
        message: data.message || 'Error al obtener último pago'
      };
    }

    if (data.success && data.data) {
      console.log('✅ Último pago obtenido:', data.data.id_pay);
      return {
        success: true,
        data: data.data,
        message: 'Último pago obtenido exitosamente'
      };
    } else {
      console.log('ℹ️ No hay pagos para esta aplicación');
      return {
        success: true,
        data: null,
        message: 'No hay pagos registrados'
      };
    }
  } catch (error) {
    console.error('❌ Error al obtener último pago:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error inesperado'
    };
  }
};
