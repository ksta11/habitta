import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { isTokenExpired } from '../utils/Tokens';

// Base URL de la API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Constantes para AsyncStorage
const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Cliente HTTP centralizado con manejo automático de tokens
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Obtiene el token almacenado
   */
  private async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error al obtener token:', error);
      return null;
    }
  }

  /**
   * Limpia los datos de autenticación almacenados
   */
  private async clearStoredAuth(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY)
      ]);
      console.log('🗑️ Datos de autenticación eliminados');
    } catch (error) {
      console.error('❌ Error al limpiar datos de autenticación:', error);
    }
  }

  /**
   * Maneja token expirado
   */
  private async handleExpiredToken(): Promise<void> {
    console.log('🚨 Token expirado detectado en API call - limpiando sesión');
    await this.clearStoredAuth();
    router.replace('/auth/login');
  }

  /**
   * Verifica si el token es válido antes de hacer la petición
   */
  private async validateToken(): Promise<boolean> {
    const token = await this.getStoredToken();
    
    if (!token) {
      console.log('ℹ️ No hay token almacenado');
      return false;
    }

    if (isTokenExpired(token)) {
      console.log('🚨 Token expirado detectado en validación previa');
      await this.handleExpiredToken();
      return false;
    }

    return true;
  }

  /**
   * Configura los headers por defecto
   */
  private async getHeaders(additionalHeaders: Record<string, string> = {}): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    const token = await this.getStoredToken();
    if (token && !isTokenExpired(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Maneja respuestas de error relacionadas con autenticación
   */
  private async handleAuthError(response: Response): Promise<void> {
    if (response.status === 401 || response.status === 403) {
      console.log('🚨 Error de autenticación en respuesta de API:', response.status);
      await this.handleExpiredToken();
      throw new Error('Token expirado o inválido');
    }
  }

  /**
   * Método GET
   */
  async get<T = any>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      if (requiresAuth && !(await this.validateToken())) {
        return {
          success: false,
          error: 'Token expirado o no válido'
        };
      }

      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers
      });

      if (requiresAuth) {
        await this.handleAuthError(response);
      }

      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || data.error || 'Error en la petición',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error en GET:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Método POST
   */
  async post<T = any>(endpoint: string, body: any = {}, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      if (requiresAuth && !(await this.validateToken())) {
        return {
          success: false,
          error: 'Token expirado o no válido'
        };
      }

      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (requiresAuth) {
        await this.handleAuthError(response);
      }

      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || data.error || 'Error en la petición',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error en POST:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Método PUT
   */
  async put<T = any>(endpoint: string, body: any = {}, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      if (requiresAuth && !(await this.validateToken())) {
        return {
          success: false,
          error: 'Token expirado o no válido'
        };
      }

      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (requiresAuth) {
        await this.handleAuthError(response);
      }

      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || data.error || 'Error en la petición',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error en PUT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Método DELETE
   */
  async delete<T = any>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      if (requiresAuth && !(await this.validateToken())) {
        return {
          success: false,
          error: 'Token expirado o no válido'
        };
      }

      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers
      });

      if (requiresAuth) {
        await this.handleAuthError(response);
      }

      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || data.error || 'Error en la petición',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error en DELETE:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Método para subir archivos con FormData
   */
  async upload<T = any>(endpoint: string, formData: FormData, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    try {
      if (requiresAuth && !(await this.validateToken())) {
        return {
          success: false,
          error: 'Token expirado o no válido'
        };
      }

      const headers: Record<string, string> = {};
      
      const token = await this.getStoredToken();
      if (token && !isTokenExpired(token)) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (requiresAuth) {
        await this.handleAuthError(response);
      }

      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || data.error || 'Error en la petición',
        message: data.message
      };
    } catch (error) {
      console.error('❌ Error en UPLOAD:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient();

// Exportar también la clase para casos especiales
export default ApiClient;
