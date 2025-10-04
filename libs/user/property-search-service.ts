import { Property } from '../../interfaces/property/PropertyInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TOKEN_KEY = '@habitta_token';

// Interfaces para la búsqueda de propiedades
export interface PropertySearchFilters {
  searchTerm?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  type?: string;
}

export interface PropertySearchResponse {
  success: boolean;
  message: string;
  data: Property[];
  filters: Record<string, string>;
}

// Función para buscar propiedades con filtros
export const searchProperties = async (filters: PropertySearchFilters): Promise<PropertySearchResponse> => {
  try {
    console.log('🔍 Iniciando búsqueda de propiedades con filtros:', filters);
    
    // Obtener token para la autorización
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return {
        success: false,
        message: 'Token de autenticación no encontrado',
        data: [],
        filters: {}
      };
    }
    
    // Construir query parameters
    const queryParams = new URLSearchParams();
    
    // Mapear filtros a los parámetros del backend
    if (filters.city && filters.city !== 'todos') {
      queryParams.append('city', filters.city);
    }
    
    if (filters.minPrice && filters.minPrice > 0) {
      queryParams.append('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice && filters.maxPrice < 5000000) {
      queryParams.append('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.minRooms && filters.minRooms > 0) {
      queryParams.append('minRooms', filters.minRooms.toString());
    }
    
    if (filters.minBathrooms && filters.minBathrooms > 0) {
      queryParams.append('minBathrooms', filters.minBathrooms.toString());
    }
    
    if (filters.minArea && filters.minArea > 0) {
      queryParams.append('minArea', filters.minArea.toString());
    }
    
    if (filters.maxArea && filters.maxArea < 500) {
      queryParams.append('maxArea', filters.maxArea.toString());
    }
    
    if (filters.type && filters.type !== 'todos') {
      queryParams.append('type', filters.type);
    }
    
    const url = `${API_BASE_URL}/api/properties/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🌐 URL de búsqueda:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Status de respuesta:', response.status);
    
    const data = await response.json();
    console.log('📊 Respuesta completa:', data);
    
    if (!response.ok) {
      console.log('❌ Error en la respuesta:', data.message);
      return {
        success: false,
        message: data.message || 'Error al buscar propiedades',
        data: [],
        filters: {}
      };
    }
    
    console.log(`✅ ${data.data.length} propiedades encontradas exitosamente`);
    
    return {
      success: true,
      message: data.message || 'Propiedades encontradas exitosamente',
      data: data.data || [],
      filters: data.filters || {}
    };
    
  } catch (error) {
    console.error('💥 Error crítico al buscar propiedades:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: [],
      filters: {}
    };
  }
};

// Función para obtener todas las propiedades publicadas (sin filtros)
export const getAllPublishedProperties = async (): Promise<PropertySearchResponse> => {
  try {
    console.log('🏠 Obteniendo todas las propiedades publicadas...');
    
    // Obtener token para la autorización
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return {
        success: false,
        message: 'Token de autenticación no encontrado',
        data: [],
        filters: {}
      };
    }
    
    const url = `${API_BASE_URL}/api/properties/search`;
    console.log('🌐 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Status de respuesta:', response.status);
    
    const data = await response.json();
    console.log('📊 Respuesta completa:', data);
    
    if (!response.ok) {
      console.log('❌ Error en la respuesta:', data.message);
      return {
        success: false,
        message: data.message || 'Error al obtener propiedades',
        data: [],
        filters: {}
      };
    }
    
    console.log(`✅ ${data.data.length} propiedades obtenidas exitosamente`);
    
    return {
      success: true,
      message: data.message || 'Propiedades obtenidas exitosamente',
      data: data.data || [],
      filters: data.filters || {}
    };
    
  } catch (error) {
    console.error('💥 Error crítico al obtener propiedades:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de conexión',
      data: [],
      filters: {}
    };
  }
};

// Función para obtener ciudades únicas (a partir de una búsqueda sin filtros)
export const getAvailableCities = async (): Promise<string[]> => {
  try {
    const response = await getAllPublishedProperties();
    if (response.success) {
      const cities = response.data.map(property => property.city).filter(Boolean);
      return [...new Set(cities)].sort();
    }
    return [];
  } catch (error) {
    console.error('❌ Error al obtener ciudades:', error);
    return [];
  }
};