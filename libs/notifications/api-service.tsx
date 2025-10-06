import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TOKEN_KEY = '@habitta_token';

/**
 * Envía el push token al backend para asociarlo con el usuario actual
 */
export const sendPushTokenToBackend = async (pushToken: string): Promise<void> => {
  try {
    const authToken = await AsyncStorage.getItem(TOKEN_KEY);
    
    if (!authToken) {
      console.log('⚠️ No hay token de autenticación, no se puede enviar push token');
      return;
    }

    console.log('📤 Enviando push token al backend...');
    
    const response = await fetch(`${API_BASE_URL}/api/auth/push-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        pushToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar push token');
    }

    console.log('✅ Push token enviado al backend exitosamente');
  } catch (error) {
    console.error('❌ Error al enviar push token al backend:', error);
    throw error;
  }
};

/**
 * Guarda el push token localmente para comparaciones futuras
 */
export const savePushTokenLocally = async (pushToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('@habitta_push_token', pushToken);
    console.log('💾 Push token guardado localmente');
  } catch (error) {
    console.error('❌ Error al guardar push token localmente:', error);
  }
};

/**
 * Obtiene el push token guardado localmente
 */
export const getStoredPushToken = async (): Promise<string | null> => {
  try {
    const storedToken = await AsyncStorage.getItem('@habitta_push_token');
    return storedToken;
  } catch (error) {
    console.error('❌ Error al obtener push token local:', error);
    return null;
  }
};

/**
 * Verifica si el push token ha cambiado y lo actualiza si es necesario
 */
export const updatePushTokenIfChanged = async (currentToken: string): Promise<boolean> => {
  try {
    const storedToken = await getStoredPushToken();
    
    if (storedToken !== currentToken) {
      console.log('🔄 Push token ha cambiado, actualizando...');
      await sendPushTokenToBackend(currentToken);
      await savePushTokenLocally(currentToken);
      return true; // Token fue actualizado
    }
    
    console.log('ℹ️ Push token no ha cambiado');
    return false; // Token no cambió
  } catch (error) {
    console.error('❌ Error al verificar/actualizar push token:', error);
    return false;
  }
};

/**
 * Elimina el push token del backend al cerrar sesión
 */
export const removePushTokenFromBackend = async (): Promise<void> => {
  try {
    const authToken = await AsyncStorage.getItem(TOKEN_KEY);
    
    if (!authToken) {
      console.log('⚠️ No hay token de autenticación para eliminar push token');
      return;
    }

    console.log('🗑️ Eliminando push token del backend...');
    
    const response = await fetch(`${API_BASE_URL}/api/auth/push-token`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error al eliminar push token:', errorData.message);
      // No lanzamos error aquí porque el logout debe continuar aunque falle esto
    } else {
      console.log('✅ Push token eliminado del backend exitosamente');
    }
  } catch (error) {
    console.error('❌ Error al eliminar push token del backend:', error);
    // No relanzamos el error para no bloquear el logout
  }
};

/**
 * Limpia el push token almacenado localmente
 */
export const clearStoredPushToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('@habitta_push_token');
    console.log('🗑️ Push token local eliminado');
  } catch (error) {
    console.error('❌ Error al eliminar push token local:', error);
  }
};