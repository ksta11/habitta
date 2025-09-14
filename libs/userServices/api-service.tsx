import { UserDTO, UserDAO, UserResponseDAO, ChangePasswordDTO, BooleanDAO, BeAnOwnerDAO } from '../../interfaces/UserInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración para Expo Go (dispositivo físico):
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.12:3000';

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
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/profile`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        message: 'Token de autenticación no encontrado',
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

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
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
      return {
        message: data.message || 'Error al obtener perfil',
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
      message: data.message || 'Perfil obtenido exitosamente',
      user: data.data?.user || data.user || {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
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
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/profile`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        message: 'Token de autenticación no encontrado',
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

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
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
        message: data.message || 'Error al actualizar perfil',
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
      message: data.message || 'Perfil actualizado exitosamente',
      user: data.data?.user || data.user || {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
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
 * Cambiar contraseña del usuario actual
 */
export const changePassword = async (changePasswordData: ChangePasswordDTO): Promise<BooleanDAO> => {
  try {
    console.log('🔐 Cambiando contraseña...');
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/users/change-password`);
    
    const token = await getAuthToken();
    if (!token) {
      return {
        message: 'Token de autenticación no encontrado',
        success: false
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(changePasswordData),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        message: data.message || 'Error al cambiar contraseña',
        success: false
      };
    }

    return {
      message: data.message || 'Contraseña cambiada exitosamente',
      success: true
    };

  } catch (error) {
    console.error('❌ Error changePassword:', error);
    
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