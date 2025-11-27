import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  searchProperties,
  getAllPublishedProperties,
  getAvailableCities,
  PropertySearchFilters,
} from '../../../libs/user/property-search-service';
import { Property } from '../../../interfaces/property/PropertyInterface';
import { hapticFeedback } from '../../../utils/haptics';

/**
 * Hook para manejar la lógica de propiedades
 * @returns Estado y funciones para manejar propiedades
 */
export const useProperties = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]); // ✅ Todas las propiedades sin filtrar
  const [properties, setProperties] = useState<Property[]>([]); // ✅ Propiedades filtradas mostradas
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
        setAllProperties(response.data); // ✅ Guardar todas las propiedades
        setProperties(response.data); // ✅ Mostrar todas inicialmente
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
   * 🔍 Filtra propiedades en el frontend por término de búsqueda
   */
  const filterPropertiesBySearchTerm = (searchTerm: string): Property[] => {
    if (!searchTerm || searchTerm.trim() === '') {
      console.log('🔍 [useProperties] Sin término de búsqueda, mostrando todas');
      return allProperties;
    }

    const term = searchTerm.toLowerCase().trim();
    console.log('🔍 [useProperties] Filtrando por término:', term);

    const filtered = allProperties.filter((property) => {
      // Buscar en título
      const matchesTitle = property.title?.toLowerCase().includes(term);
      
      // Buscar en descripción
      const matchesDescription = property.description?.toLowerCase().includes(term);
      
      // Buscar en dirección
      const matchesAddress = property.address?.toLowerCase().includes(term);
      
      // Buscar en ciudad
      const matchesCity = property.city?.toLowerCase().includes(term);
      
      // Buscar en tipo de propiedad
      const matchesType = property.type?.toLowerCase().includes(term);

      return matchesTitle || matchesDescription || matchesAddress || matchesCity || matchesType;
    });

    console.log(`🔍 [useProperties] ${filtered.length} propiedades coinciden con "${term}"`);
    return filtered;
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
        // ✅ Guardar todas las propiedades del backend
        setAllProperties(response.data);
        
        // ✅ Si hay searchTerm, filtrar en el frontend
        if (filters.searchTerm && filters.searchTerm.trim() !== '') {
          const filtered = filterPropertiesBySearchTerm(filters.searchTerm);
          setProperties(filtered);
          console.log(`✅ [useProperties] ${filtered.length} propiedades filtradas de ${response.data.length}`);
        } else {
          setProperties(response.data);
          console.log(`✅ [useProperties] ${response.data.length} propiedades encontradas`);
        }
        
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
    // Feedback háptico al completar el refresh
    hapticFeedback.refresh();
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
    allProperties, // ✅ Exponer todas las propiedades
    loading,
    refreshing,
    error,

    // Funciones
    loadProperties,
    searchPropertiesWithFilters,
    filterPropertiesBySearchTerm, // ✅ Exponer función de filtrado
    refresh,

    // Utilidades
    formatPrice,
    getPropertyImage,
  };
};
