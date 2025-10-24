import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  searchProperties,
  getAllPublishedProperties,
  getAvailableCities,
  PropertySearchFilters,
} from '../../../libs/user/property-search-service';
import { Property } from '../../../interfaces/property/PropertyInterface';

/**
 * Hook para manejar la lógica de propiedades
 * @returns Estado y funciones para manejar propiedades
 */
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todas las propiedades publicadas
   */
  const loadProperties = async () => {
    try {
      console.log('🏠 [useProperties] Cargando propiedades iniciales...');
      setLoading(true);
      setError(null);

      const response = await getAllPublishedProperties();

      if (response.success) {
        setProperties(response.data);
        console.log(`✅ [useProperties] ${response.data.length} propiedades cargadas`);
      } else {
        console.log('❌ [useProperties] Error:', response.message);
        setError(response.message || 'No se pudieron cargar las propiedades');
        Alert.alert(
          'Error',
          response.message || 'No se pudieron cargar las propiedades'
        );
        setProperties([]);
      }
    } catch (err) {
      console.error('💥 [useProperties] Error crítico:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      Alert.alert('Error', 'Error de conexión al cargar las propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Busca propiedades con filtros específicos
   */
  const searchPropertiesWithFilters = async (filters: PropertySearchFilters) => {
    try {
      console.log('🔍 [useProperties] Buscando con filtros:', filters);
      setLoading(true);
      setError(null);

      const response = await searchProperties(filters);

      if (response.success) {
        setProperties(response.data);
        console.log(`✅ [useProperties] ${response.data.length} propiedades encontradas`);
        return response.data;
      } else {
        console.log('❌ [useProperties] Error en búsqueda:', response.message);
        setError(response.message || 'No se pudieron aplicar los filtros');
        Alert.alert(
          'Error',
          response.message || 'No se pudieron aplicar los filtros'
        );
        setProperties([]);
        return [];
      }
    } catch (err) {
      console.error('💥 [useProperties] Error en búsqueda:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      Alert.alert('Error', 'Error de conexión al aplicar filtros');
      setProperties([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresca la lista de propiedades
   */
  const refresh = async () => {
    setRefreshing(true);
    await loadProperties();
  };

  /**
   * Formatea el precio a formato de moneda
   */
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-MX')}`;
  };

  /**
   * Obtiene la URL de la primera imagen de una propiedad
   */
  const getPropertyImage = (property: Property): string => {
    return property.images && property.images.length > 0
      ? property.images[0].url_image
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop';
  };

  // Cargar propiedades al montar el componente
  useEffect(() => {
    loadProperties();
  }, []);

  return {
    // Estado
    properties,
    loading,
    refreshing,
    error,

    // Funciones
    loadProperties,
    searchPropertiesWithFilters,
    refresh,

    // Utilidades
    formatPrice,
    getPropertyImage,
  };
};
