import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  id_application: string;
  id_author: string;
  id_receiver: string;
  rating: number | null;
  comment: string | null;
  context_type: string;
  weight: string;
  status: 'pending' | 'published';
  create_date: string;
  // Campos adicionales retornados por el backend para mostrar en la UI de review
  property_title?: string;
  receiver_name?: string;
}

export interface UpdateReviewData {
  comment: string;
  // `rating` used as recommended flag: true -> recomendado, false -> no recomendado
  rating?: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TOKEN_KEY = '@habitta_token';

/**
 * Función de diagnóstico para verificar el estado del token
 */
export const debugTokenInfo = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    console.log('🔍 DEBUG: Token existe?', !!token);
    console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL);
    
    if (token) {
      // Decodificar el JWT para ver la información (sin verificar la firma)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔍 DEBUG: Token payload completo:', payload);
        console.log('🔍 DEBUG: User ID (userId):', payload.userId);
        console.log('🔍 DEBUG: User ID (id):', payload.id);
        console.log('🔍 DEBUG: User ID (sub):', payload.sub);
        console.log('🔍 DEBUG: Todos los campos del payload:', Object.keys(payload));
        console.log('🔍 DEBUG: Token expira:', new Date(payload.exp * 1000));
      } catch (e) {
        console.log('🔍 DEBUG: No se pudo decodificar el token:', e);
      }
    }
  } catch (error) {
    console.error('🔍 DEBUG: Error al verificar token:', error);
  }
};

/**
 * Obtiene todas las reviews recibidas por un usuario
 */
export const getReceivedReviews = async (userId: string) => {
  try {
    console.log('🔍 Obteniendo reviews recibidas para usuario:', userId);
    
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

    const response = await fetch(`${API_BASE_URL}/api/reviews/received/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta:', response.status);
    const result = await response.json();
    console.log('📊 Respuesta completa:', result);

    if (!response.ok) {
      console.log('❌ Error en la respuesta:', result.message);
      throw new Error(result.message || 'Error al obtener las reviews');
    }

    console.log(`✅ ${result.data.length} reviews obtenidas exitosamente`);
    return {
      success: true,
      data: result.data as Review[],
      message: result.message
    };
  } catch (error) {
    console.error('💥 Error en getReceivedReviews:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene todas las reviews pendientes de completar por el usuario actual como author
 */
export const getPendingReviewsAsAuthor = async () => {
  try {
    console.log('🔍 Obteniendo reviews pendientes como author...');
    
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

    console.log('🔑 Token encontrado, haciendo petición...');

    // Usar el nuevo endpoint específico para reviews pendientes del usuario actual
    const response = await fetch(`${API_BASE_URL}/api/reviews/pending/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta:', response.status);
    console.log('📡 Headers de respuesta:', response.headers);
    
    const result = await response.json();
    console.log('📊 Respuesta completa del backend:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.log('❌ Error en la respuesta:', result.message);
      console.log('❌ Status:', response.status);
      console.log('❌ Status Text:', response.statusText);
      throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log(`✅ ${result.data?.length || 0} reviews pendientes como author obtenidas exitosamente`);
    console.log('📝 Reviews obtenidas:', result.data);
    
    return {
      success: true,
      data: result.data as Review[],
      message: result.message
    };
  } catch (error) {
    console.error('💥 Error detallado en getPendingReviewsAsAuthor:', error);
    console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene una review específica por su ID
 */
export const getReview = async (reviewId: string) => {
  try {
    console.log('🔍 Obteniendo review específica:', reviewId);
    
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

    console.log('🔑 Token encontrado, haciendo petición para review:', reviewId);

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta para getReview:', response.status);
    console.log('📡 Headers de respuesta:', response.headers);
    
    const result = await response.json();
    console.log('📊 Respuesta completa para getReview:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.log('❌ Error en getReview:', result.message);
      console.log('❌ Status:', response.status);
      console.log('❌ Status Text:', response.statusText);
      throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Review específica obtenida exitosamente');
    console.log('📝 Datos de la review:', result.data);
    
    return {
      success: true,
      data: result.data as Review,
      message: result.message
    };
  } catch (error) {
    console.error('💥 Error detallado en getReview:', error);
    console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Actualiza una review (agregar comentario y cambiar status)
 */
export const updateReview = async (reviewId: string, reviewData: UpdateReviewData) => {
  try {
    console.log('🔄 Actualizando review:', reviewId, reviewData);
    
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

    // Preparar datos según el esquema del backend
    const updateData = {
      comment: reviewData.comment || null,
      // use provided boolean rating (recommended) if present, otherwise omit
      rating: typeof reviewData.rating === 'boolean' ? reviewData.rating : undefined,
      status: 'published'
    };

    console.log('📤 Datos preparados según esquema del backend:', updateData);

    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log('📡 Status de respuesta:', response.status);
    const result = await response.json();
    console.log('📊 Respuesta completa:', result);

    if (!response.ok) {
      console.log('❌ Error en la respuesta:', result.message);
      throw new Error(result.message || 'Error al actualizar la review');
    }

    console.log('✅ Review actualizada exitosamente');
    return {
      success: true,
      data: result.data as Review,
      message: result.message
    };
  } catch (error) {
    console.error('💥 Error en updateReview:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};