import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { LoginDTO, LoginResponse } from '../interfaces/LoginInterface';
import { RegisterDTO, RegisterFormDTO } from '../interfaces/RegisterInterface';
import { authenticationUser } from '../libs/auth/login/api-service';
import { registerUser } from '../libs/auth/register/api-service';
import { confirmVerificationCode } from '../libs/auth/verify/api-service';
import { clearStoredPushToken, removePushTokenFromBackend, sendPushTokenToBackend } from '../libs/notifications/api-service';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationAsync';
import { getTokenTimeToExpiry, isTokenExpired } from '../utils/Tokens';

// Tipos para el contexto
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  creation_date?: string;
}

interface AuthContextType {
  // Estado
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Funciones de autenticación
  login: (credentials: LoginDTO) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterFormDTO) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  confirmVerification: (userId: string, verificationCode: string) => Promise<{ success: boolean; message?: string }>;
  
  // Utilidades
  refreshUser: () => Promise<void>;
  updateUserData: (updatedUserData: User) => Promise<void>;
  clearError: () => void;
  updateAuthData: (newToken: string, newUser: User) => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Constantes para AsyncStorage
const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Provider del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Referencias para intervalos de verificación
  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef<boolean>(false);

  // Estado computado
  const isAuthenticated = !!user && !!token;

  // Cargar datos almacenados al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Configurar verificación periódica del token cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && token) {
      startTokenExpirationCheck();
    } else {
      stopTokenExpirationCheck();
    }

    // Cleanup al desmontar o cambiar token
    return () => {
      stopTokenExpirationCheck();
    };
  }, [isAuthenticated, token]);

  

  // Función para enviar push token tras autenticación
  const sendPushTokenOnAuth = async () => {
    try {
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await sendPushTokenToBackend(pushToken);
        console.log('📤 Push token enviado tras autenticación');
      }
    } catch (error) {
      console.error('❌ Error al enviar push token tras autenticación:', error);
    }
  };

  // Función para iniciar la verificación periódica del token
  const startTokenExpirationCheck = () => {
    if (!token) return;

    // Limpiar intervalo anterior si existe
    stopTokenExpirationCheck();

    // Verificar inmediatamente
    checkTokenExpiration();

    // Configurar verificación cada 30 segundos
    tokenCheckIntervalRef.current = setInterval(() => {
      checkTokenExpiration();
    }, 30000); // 30 segundos

    console.log('🕐 Verificación automática de expiración de token iniciada');
  };

  // Función para detener la verificación periódica
  const stopTokenExpirationCheck = () => {
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
      console.log('⏹️ Verificación automática de expiración de token detenida');
    }
    warningShownRef.current = false;
  };

  // Función para verificar si el token ha expirado
  const checkTokenExpiration = async () => {
    if (!token) return;

    try {
      if (isTokenExpired(token)) {
        console.log('🚨 Token expirado detectado - cerrando sesión automáticamente');
        await handleTokenExpired();
        return;
      }

      // Verificar si queda poco tiempo (ej: menos de 5 minutos)
      const timeToExpiry = getTokenTimeToExpiry(token);
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos

      if (timeToExpiry <= fiveMinutes && timeToExpiry > 0 && !warningShownRef.current) {
        warningShownRef.current = true;
        console.log('⚠️ Token expirará pronto:', Math.floor(timeToExpiry / 1000 / 60), 'minutos');
        // Aquí podrías mostrar una notificación al usuario si quisieras
      }
    } catch (error) {
      console.error('❌ Error al verificar expiración del token:', error);
    }
  };

  // Función para manejar token expirado
  const handleTokenExpired = async () => {
    try {
      console.log('🔐 Manejando token expirado...');
      
      // Limpiar estado
      setUser(null);
      setToken(null);
      
      // Limpiar almacenamiento
      await clearStoredAuth();
      
      // Limpiar push token local (no intentamos eliminarlo del backend porque el token ya expiró)
      await clearStoredPushToken();
      
      // Detener verificaciones
      stopTokenExpirationCheck();
      
      // Redirigir al login
      router.replace('/auth/login');
      
      console.log('✅ Sesión cerrada automáticamente por token expirado');
    } catch (error) {
      console.error('❌ Error al manejar token expirado:', error);
    }
  };


  // Cargar token y usuario almacenados
  const loadStoredAuth = async () => {
    try {
      console.log('🔄 Cargando datos de autenticación almacenados...');
      
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY)
      ]);

      if (storedToken && storedUser) {
        // Verificar si el token almacenado ya expiró
        if (isTokenExpired(storedToken)) {
          console.log('🚨 Token almacenado ya expiró - limpiando datos');
          await clearStoredAuth();
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log('✅ Datos de autenticación cargados:', userData.email);
        
        // Enviar push token al backend tras restaurar sesión
        sendPushTokenOnAuth();
      } else {
        console.log('ℹ️ No hay datos de autenticación almacenados');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos de autenticación:', error);
      // Limpiar datos corruptos
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // Almacenar datos de autenticación
  const storeAuth = async (authToken: string, userData: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
      ]);
      console.log('💾 Datos de autenticación almacenados');
    } catch (error) {
      console.error('❌ Error al almacenar datos de autenticación:', error);
    }
  };

  // Limpiar datos almacenados
  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY)
      ]);
      console.log('🗑️ Datos de autenticación eliminados');
    } catch (error) {
      console.error('❌ Error al limpiar datos de autenticación:', error);
    }
  };

  // Función de login
  const login = async (credentials: LoginDTO): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('🔐 Iniciando proceso de login...');
      
      const result: LoginResponse = await authenticationUser(credentials);
      
      // Caso: usuario existe pero no está verificado
      if (result.success && result.user && result.user.status === 'Unverified') {
        console.log('⚠️ Cuenta no verificada - redirigiendo a verificación');

        // No almacenamos token (el backend no lo proporciona en este caso)
        setUser(result.user);

        // Redirigir a la ruta dinámica de verificación usando el id del usuario
        const verifyPath = `/auth/verify/${result.user.id}`;
        console.log('🚀 Redirigiendo a:', verifyPath);
        router.replace({ pathname: '/auth/verify/[id]', params: { id: result.user.id } });

        return { success: true, message: result.message };
      }

      // Caso normal: success + token + user (y usuario verificado)
      if (result.success && result.token && result.user) {
        console.log('✅ Login exitoso');

        // Almacenar datos
        await storeAuth(result.token, result.user);

        // Actualizar estado
        setToken(result.token);
        setUser(result.user);

        // Enviar push token al backend tras login exitoso
        sendPushTokenOnAuth();

        // Redirigir según el rol
        let redirectPath: Parameters<typeof router.replace>[0];
        switch (result.user.role) {
          case 'admin':
            redirectPath = '/(admin)/home';
            break;
          case 'owner':
            redirectPath = '/(owner)/(properties)';
            break;
          case 'user':
          default:
            redirectPath = '/(user)/(home)';
            break;
        }
        console.log('🚀 Redirigiendo a:', redirectPath);
        router.replace(redirectPath);

        return { success: true, message: result.message };
      }

      console.log('❌ Login fallido:', result.message);
      return { success: false, message: result.message };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error inesperado durante el login' 
      };
    }
  };

  // Confirmar verificación de cuenta usando el código enviado al usuario
  const confirmVerification = async (userId: string, verificationCode: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await confirmVerificationCode(userId, verificationCode);

      // Log full result for debugging when something is unexpected
      console.log('📣 confirmVerification result:', result);

      if (!result.success) {
        console.warn('⚠️ Confirm verification failed:', result);
        return { success: false, message: result.message || JSON.stringify(result) };
      }

      if (result.token && result.user) {
        await updateAuthData(result.token, result.user);
        sendPushTokenOnAuth();

        // Redirigir según rol
        let redirectPath: Parameters<typeof router.replace>[0];
        switch (result.user.role) {
          case 'admin':
            redirectPath = '/(admin)/home';
            break;
          case 'owner':
            redirectPath = '/(owner)/(properties)';
            break;
          case 'user':
          default:
            redirectPath = '/(user)/home';
            break;
        }
        router.replace(redirectPath);

        return { success: true, message: result.message };
      }

      return { success: false, message: result.message || 'Respuesta inesperada del servidor' };
    } catch (error) {
      console.error('❌ Error al confirmar verificación:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error inesperado' };
    }
  };

  // Función de registro
  const register = async (userData: RegisterFormDTO): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('📝 Iniciando proceso de registro...');
      
      // Crear objeto con role automático para la API
      const registerData: RegisterDTO = {
        ...userData,
        role: 'user'
      };
      
      const result = await registerUser(registerData);
      
      if (result.success && result.user) {
        console.log('✅ Registro exitoso - usuario creado');

        // Colocar un usuario parcial en el contexto para que ScreenVerify pueda acceder si es necesario
        const partialUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: 'user'
        };
        setUser(partialUser);

        // Redirigir directamente a la verificación usando la ruta dinámica
        router.replace({ pathname: '/auth/verify/[id]', params: { id: result.user.id } });

        return { success: true, message: result.message };
      } else {
        console.log('❌ Registro fallido:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error inesperado durante el registro' 
      };
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      // Eliminar push token del backend antes de limpiar el token de auth
      await removePushTokenFromBackend();
      
      // Detener verificación de token
      stopTokenExpirationCheck();
      
      // Limpiar estado
      setUser(null);
      setToken(null);
      
      // Limpiar almacenamiento
      await clearStoredAuth();
      
      // Limpiar push token local
      await clearStoredPushToken();
      
      // Redirigir al login
      router.replace('/auth/login');
      
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  // Refrescar datos del usuario
  const refreshUser = async (): Promise<void> => {
    try {
      console.log('🔄 Refrescando datos del usuario...');
      // Aquí podrías hacer una llamada a la API para obtener datos actualizados del usuario
      // Por ahora, solo recargamos desde el almacenamiento
      await loadStoredAuth();
    } catch (error) {
      console.error('❌ Error al refrescar usuario:', error);
    }
  };


  // Actualizar datos del usuario en el contexto
  const updateUserData = async (updatedUserData: User): Promise<void> => {
    try {
        console.log('🔄 Actualizando datos del usuario en el contexto...');
        console.log('📋 Datos recibidos:', updatedUserData);
        console.log('📋 Usuario actual antes de actualizar:', user);
      
      // Actualizar el estado local
        setUser(updatedUserData);
      
      // Actualizar el almacenamiento
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUserData));
      
      console.log('✅ Datos del usuario actualizados en el contexto');
      console.log('📋 Usuario actual después de actualizar:', updatedUserData);
    } catch (error) {
      console.error('❌ Error al actualizar datos del usuario:', error);

    };
  };
  // Actualizar datos de autenticación (token y usuario)
  const updateAuthData = async (newToken: string, newUser: User): Promise<void> => {
    try {
      console.log('🔄 Actualizando datos de autenticación...');
      
      // Actualizar estado
      setToken(newToken);
      setUser(newUser);
      
      // Almacenar nuevos datos
      await storeAuth(newToken, newUser);
      
      console.log('✅ Datos de autenticación actualizados exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar datos de autenticación:', error);
    }
  };

  // Limpiar errores (por si quieres manejar errores en el contexto)
  const clearError = (): void => {
    // Implementar según necesites
    console.log('🧹 Errores limpiados');
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    // Estado
    user,
    token,
    isLoading,
    isAuthenticated,
    
    // Funciones
    login,
    register,
    confirmVerification,
    logout,
    refreshUser,
    updateUserData,
    clearError,
    updateAuthData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};