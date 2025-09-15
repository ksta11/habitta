
import { UserDTO, UserDAO, UserResponseDAO, ChangePasswordDTO, BooleanDAO, BeAnOwnerDAO, VerifyDAO } from '../../interfaces/UserInterface';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración para Expo Go (dispositivo físico):
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.12:3000';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Función helper para obtener el token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('@habitta_token');
    return token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};


// Función helper para validar token y manejar errores de autenticación
const handleAuthError = async (response: Response, data: any) => {
  if (response.status === 401) {
    console.log('🔐 Token inválido o expirado, limpiando sesión...');
    
    // Limpiar datos de autenticación
    try {
      await AsyncStorage.multiRemove(['@habitta_token', '@habitta_user']);
    } catch (error) {
      console.error('❌ Error limpiando datos de autenticación:', error);
    }
    
    // Redirigir al login
    const { router } = require('expo-router');
    router.replace('/auth/login');
    
    return {
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      user: {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        creation_date: new Date()
      }
    };
  }
  
  return {
    message: data.message || 'Error en la petición',
    user: {
      _id: '',
      name: '',
      email: '',
      phone: '',
      role: '',
      creation_date: new Date()
    }
  };
};

// Función helper para validar token antes de hacer peticiones
const validateTokenBeforeRequest = async (): Promise<{ isValid: boolean; message?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        isValid: false,
        message: 'No hay token de autenticación. Por favor, inicia sesión.'
      };
    }
    
    // Verificar que el token no esté vacío o sea inválido
    if (token.trim() === '' || token === 'null' || token === 'undefined') {
      return {
        isValid: false,
        message: 'Token de autenticación inválido. Por favor, inicia sesión.'
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error('❌ Error validando token:', error);
    return {
      isValid: false,
      message: 'Error validando autenticación. Por favor, inicia sesión.'
    };

const getAuthUser = async (): Promise<string | null> => {
  try {
    const user = await AsyncStorage.getItem('@habitta_user');
    return user;
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return null;

  }
};

/**
 * Actualizar usuario por ID
 */
export const updateUser = async (id: string, userData: UserDTO): Promise<UserDAO> => {
  try {
    console.log('✏️ Actualizando usuario:', id);
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/${id}`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        message: 'Token de autenticación no encontrado',
        user: {
          _id: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        message: data.message || 'Error al actualizar usuario',
        user: {
          _id: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }

    return {
      message: data.message || 'Usuario actualizado exitosamente',
      user: data.data?.user || data.user || {
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        creation_date: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Error updateUser:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        user: {
          _id: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    return {
      message: error instanceof Error ? error.message : 'Error de conexión',
      user: {
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        creation_date: new Date()
      }
    };
  }
  
};

/**
 * Obtener perfil del usuario actual
 */
export const getCurrentUserProfile = async (): Promise<UserResponseDAO> => {
  try {
    console.log('👤 Obteniendo perfil del usuario actual...');
    
    // Obtener datos del usuario desde AsyncStorage
    const userDataString = await AsyncStorage.getItem(USER_KEY);
    if (!userDataString) {
      console.log('❌ No se encontraron datos del usuario en AsyncStorage');
      return {
        message: 'Usuario no autenticado',
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    const storedUserData = JSON.parse(userDataString);
    const userId = storedUserData.id;
    console.log('👤 User ID:', userId);
    
    // Validar token antes de hacer la petición
    const tokenValidation = await validateTokenBeforeRequest();
    if (!tokenValidation.isValid) {
      return {
        message: tokenValidation.message || 'Token de autenticación no válido',
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/api/users/${userId}`;
    console.log('🔗 Intentando conectar a:', url);

    const response = await fetch(url, {
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

    // El backend devuelve: { success: true, message: '...', data: user }
    return {
      message: data.message || 'Perfil obtenido exitosamente',
      user: data.data || {
        _id: userId,
        name: storedUserData.name || '',
        email: storedUserData.email || '',
        phone: storedUserData.phone || '',
        role: storedUserData.role || '',
        creation_date: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Error getCurrentUserProfile:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    return {
      message: error instanceof Error ? error.message : 'Error de conexión',
      user: {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        creation_date: new Date()
      }
    };
  }
};

/**
 * Actualizar perfil del usuario actual
 */
export const updateCurrentUserProfile = async (userData: UserDTO): Promise<UserResponseDAO> => {
  try {
    console.log('✏️ Actualizando perfil del usuario actual...');
    
    // Obtener datos del usuario desde AsyncStorage
    const userDataString = await AsyncStorage.getItem(USER_KEY);
    if (!userDataString) {
      console.log('❌ No se encontraron datos del usuario en AsyncStorage');
      return {
        message: 'Usuario no autenticado',
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    const storedUserData = JSON.parse(userDataString);
    const userId = storedUserData.id;
    console.log('👤 User ID:', userId);
    
    // Validar token antes de hacer la petición
    const tokenValidation = await validateTokenBeforeRequest();
    if (!tokenValidation.isValid) {
      return {
        message: tokenValidation.message || 'Token de autenticación no válido',
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/api/users/${userId}`;
    console.log('🔗 Intentando conectar a:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return await handleAuthError(response, data);
    }

    // El backend devuelve: { success: true, message: '...', data: updatedUser }
    return {
      message: data.message || 'Perfil actualizado exitosamente',
      user: data.data || {
        _id: userId,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: storedUserData.role || '',
        creation_date: new Date()
      }
    };

  } catch (error) {
    console.error('❌ Error updateCurrentUserProfile:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        user: {
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          creation_date: new Date()
        }
      };
    }
    
    return {
      message: error instanceof Error ? error.message : 'Error de conexión',
      user: {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        creation_date: new Date()
      }
    };
  }
};

/**
 * Eliminar perfil del usuario actual
 */
export const deleteCurrentUserProfile = async(): Promise<VerifyDAO> => {
  try {
    console.log('🔐 Eliminando perfil del usuario actual...');
    
    // Obtener datos del usuario desde AsyncStorage
    const userDataString = await AsyncStorage.getItem(USER_KEY);
    if (!userDataString) {
      console.log('❌ No se encontraron datos del usuario en AsyncStorage');
      return {
        message: 'Usuario no autenticado',
        verify: false
      };
    }
    
    const storedUserData = JSON.parse(userDataString);
    const userId = storedUserData.id;
    console.log('👤 User ID para eliminar:', userId);
    
    // Validar token antes de hacer la petición
    const tokenValidation = await validateTokenBeforeRequest();
    if (!tokenValidation.isValid) {
      return {
        message: tokenValidation.message || 'Token de autenticación no válido',
        verify: false
      };
    }
    
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/api/users/${userId}`;
    console.log('🔗 Intentando conectar a:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        message: data.message || 'Error al eliminar perfil',
        verify: false
      };
    }

    // Limpiar datos de autenticación después de eliminar exitosamente
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      console.log('🗑️ Datos de autenticación eliminados');
    } catch (error) {
      console.error('❌ Error limpiando datos de autenticación:', error);
    }

    return {
      message: data.message || 'Perfil eliminado exitosamente',
      verify: true
    };

  } catch (error) {
    console.error('❌ Error deleteCurrentUserProfile:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        verify: false
      };
    }
    
    return {
      message: error instanceof Error ? error.message : 'Error de conexión',
      verify: false
    };
  }
};





/**
 * Cambiar contraseña del usuario actual
 */
// export const changePassword = async (changePasswordData: ChangePasswordDTO): Promise<BooleanDAO> => {
//   try {
//     console.log('🔐 Cambiando contraseña...');
//     console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/change-password`);
    
//     const token = await getAuthToken();
//     if (!token) {
//       return {
//         message: 'Token de autenticación no encontrado',
//         success: false
//       };
//     }

//     const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(changePasswordData),
//     });

//     console.log('✅ Conexión exitosa! Status:', response.status);
//     const data = await response.json();
//     console.log('📦 Response data:', data);

//     if (!response.ok) {
//       return {
//         message: data.message || 'Error al cambiar contraseña',
//         success: false
//       };
//     }

//     return {
//       message: data.message || 'Contraseña cambiada exitosamente',
//       success: true
//     };

//   } catch (error) {
//     console.error('❌ Error changePassword:', error);
    
//     if (error instanceof TypeError && error.message === 'Network request failed') {
//       return {
//         message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
//         success: false
//       };
//     }
    
//     return {
//       message: error instanceof Error ? error.message : 'Error de conexión',
//       success: false
//     };
//   }
// };

/**
 * Convertir usuario a propietario (owner)
 */
export const beAnOwner = async (): Promise<BeAnOwnerDAO> => {
  try {
    console.log('🏠 Convirtiendo usuario a propietario...');
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/be-an-owner`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        message: 'Token de autenticación no encontrado',
        success: false
      };
    }

    // Obtener el usuario del AsyncStorage
    const userString = await getAuthUser();
    if (!userString) {
      return {
        message: 'Usuario no encontrado en el almacenamiento local',
        success: false
      };
    }

    const user = JSON.parse(userString);
    const userId = user.id || user._id;

    if (!userId) {
      return {
        message: 'ID de usuario no encontrado',
        success: false
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/users/be-an-owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        message: data.message || 'Error al convertir usuario a propietario',
        success: false
      };
    }

    return {
      message: data.message || 'Usuario convertido a propietario exitosamente',
      success: data.success !== undefined ? data.success : true,
      data: data.data // Incluir los datos del usuario y token si están disponibles
    };

  } catch (error) {
    console.error('❌ Error beAnOwner:', error);
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. \n\n🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`,
        success: false
      };
    }
    
    return {
      message: error instanceof Error ? error.message : 'Error de conexión',
      success: false
    };
  }
};

