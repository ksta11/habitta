import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDAO } from '../../interfaces/UserInterface';
import { Application } from '../../interfaces/application/ApplicationInterface';

// Configuración para Expo Go (dispositivo físico):
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Configuración para Expo Go (dispositivo físico):
const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Interfaz para la respuesta de getAllUsers
export interface GetAllUsersResponse {
  success: boolean;
  message?: string;
  data?: UserDAO['user'][];
  error?: string;
}

// Interfaz para la respuesta de getAllProperties
export interface GetAllPropertiesResponse {
  success: boolean;
  message?: string;
  data?: any[]; // Se puede definir una interfaz específica para propiedades
  error?: string;
}


export interface GetAllApplicationsResponse {
  success: boolean;
  message?: string;
  data?: Application[];
  error?: string;
}


// Función helper para obtener el token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

// Función helper para manejar errores de autenticación
const handleAuthError = async (response: Response, data: any) => {
  if (response.status === 401) {
    console.log('🔐 Token inválido o expirado, limpiando sesión...');
    
    // Limpiar datos de autenticación
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error limpiando datos de autenticación:', error);
    }
    
    // Redirigir al login
    const { router } = require('expo-router');
    router.replace('/auth/login');
    
    return {
      success: false,
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      data: []
    };
  }
  
  return {
    success: false,
    message: data.message || 'Error en la petición',
    data: []
  };
};

/**
 * Obtener todos los usuarios (función para administradores)
 */
export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    console.log('👥 Obteniendo todos los usuarios...');
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Token de autenticación no encontrado',
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return await handleAuthError(response, data);
    }

    // El backend devuelve los usuarios directamente o en data.users
    const users = data.data || data.users || data;
    
    return {
      success: true,
      message: data.message || 'Usuarios obtenidos exitosamente',
      data: Array.isArray(users) ? users : []
    };

  } catch (error) {
    console.error('❌ Error getAllUsers:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        success: false,
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        data: []
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: []
    };
  }
};

/**
 * Obtener todas las propiedades (función para administradores)
 */
export const getAllProperties = async (): Promise<GetAllPropertiesResponse> => {
  try {
    console.log('🏠 Obteniendo todas las propiedades...');
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/properties`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Token de autenticación no encontrado',
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return await handleAuthError(response, data);
    }

    // El backend devuelve las propiedades directamente o en data.properties
    const properties = data.data || data.properties || data;
    
    return {
      success: true,
      message: data.message || 'Propiedades obtenidas exitosamente',
      data: Array.isArray(properties) ? properties : []
    };

  } catch (error) {
    console.error('❌ Error getAllProperties:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        success: false,
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        data: []
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: []
    };
  }
};

/**
 * Obtener todas las aplicaciones/solicitudes (función para administradores)
 */
export const getAllApplications = async (): Promise<GetAllApplicationsResponse> => {
  try {
    console.log('📋 Obteniendo todas las aplicaciones...');
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/applications`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Token de autenticación no encontrado',
        data: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return await handleAuthError(response, data);
    }

    // El backend devuelve las aplicaciones directamente o en data.applications
    const applications = data.data || data.applications || data;
    
    return {
      success: true,
      message: data.message || 'Aplicaciones obtenidas exitosamente',
      data: Array.isArray(applications) ? applications : []
    };

  } catch (error) {
    console.error('❌ Error getAllApplications:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        success: false,
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        data: []
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: []
    };
  }
};

/**
 * Obtener todas las solicitudes de propietarios (función para administradores)
 */