import { useState, useCallback, useEffect, useRef } from 'react';
import { getAvailableCities } from '../../../libs/user/property-search-service';

/**
 * Interfaz para los filtros de propiedades
 */
export interface PropertyFilters {
  searchTerm: string;
  category: string;
  city: string;
  priceRange: {
    min: string;
    max: string;
  };
  rooms: string;
  bathrooms: string;
  areaRange: {
    min: string;
    max: string;
  };
}

/**
 * Filtros iniciales vacíos
 */
const INITIAL_FILTERS: PropertyFilters = {
  searchTerm: '',
  category: '',
  city: '',
  priceRange: { min: '', max: '' },
  rooms: '',
  bathrooms: '',
  areaRange: { min: '', max: '' },
};

/**
 * Hook para manejar los filtros de propiedades con debounce
 * @param onFiltersApply - Callback que se ejecuta cuando los filtros cambian
 * @param debounceMs - Tiempo de debounce en milisegundos (default: 500)
 * @returns Estado y funciones para manejar filtros
 */
export const usePropertyFilters = (
  onFiltersApply: (filters: PropertyFilters) => void,
  debounceMs: number = 500
) => {
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  /**
   * Carga las ciudades disponibles
   */
  const loadAvailableCities = async () => {
    try {
      console.log('🏙️ [usePropertyFilters] Cargando ciudades disponibles...');
      const cities = await getAvailableCities();
      setAvailableCities(cities);
      console.log(`✅ [usePropertyFilters] ${cities.length} ciudades cargadas`);
    } catch (err) {
      console.error('💥 [usePropertyFilters] Error al cargar ciudades:', err);
      setAvailableCities([]);
    }
  };

  /**
   * Actualiza un filtro específico
   */
  const updateFilter = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Aplica filtros con categoría inmediatamente (sin debounce)
   * Útil para cambios de categoría que deben ser instantáneos
   */
  const applyFiltersWithCategory = (category: string) => {
    // Limpiar cualquier debounce pendiente
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const updatedFilters = {
      ...filters,
      category,
    };

    setFilters(updatedFilters);
    console.log('🏷️ [usePropertyFilters] Aplicando categoría inmediatamente:', category);
    onFiltersApply(updatedFilters);
  };

  /**
   * Aplica los filtros actuales inmediatamente (sin debounce)
   * Útil para cuando el usuario presiona "Aplicar" en el modal
   */
  const applyFiltersImmediately = () => {
    // Limpiar cualquier debounce pendiente
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    console.log('⚡ [usePropertyFilters] Aplicando filtros inmediatamente');
    onFiltersApply(filters);
  };

  /**
   * Resetea todos los filtros a sus valores iniciales
   */
  const resetFilters = () => {
    console.log('🔄 [usePropertyFilters] Reseteando filtros');
    setFilters(INITIAL_FILTERS);
    onFiltersApply(INITIAL_FILTERS);
  };

  /**
   * Muestra u oculta el modal de filtros
   */
  const toggleFiltersModal = () => {
    setShowFilters((prev) => !prev);
  };

  /**
   * Verifica si hay filtros activos
   */
  const hasActiveFilters = (): boolean => {
    return (
      filters.searchTerm !== '' ||
      filters.category !== '' ||
      filters.city !== '' ||
      filters.priceRange.min !== '' ||
      filters.priceRange.max !== '' ||
      filters.rooms !== '' ||
      filters.bathrooms !== '' ||
      filters.areaRange.min !== '' ||
      filters.areaRange.max !== ''
    );
  };

  /**
   * Cuenta la cantidad de filtros activos
   */
  const countActiveFilters = (): number => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category) count++;
    if (filters.city) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.rooms) count++;
    if (filters.bathrooms) count++;
    if (filters.areaRange.min || filters.areaRange.max) count++;
    return count;
  };

  // Cargar ciudades disponibles al montar
  useEffect(() => {
    loadAvailableCities();
  }, []);

  // Aplicar filtros cuando cambien (con debounce)
  useEffect(() => {
    // No aplicar filtros en el primer render si están todos vacíos
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // Verificar si hay algún filtro activo
      const hasAnyFilter = 
        filters.searchTerm !== '' ||
        filters.category !== '' ||
        filters.city !== '' ||
        filters.priceRange.min !== '' ||
        filters.priceRange.max !== '' ||
        filters.rooms !== '' ||
        filters.bathrooms !== '' ||
        filters.areaRange.min !== '' ||
        filters.areaRange.max !== '';
      
      // Si no hay filtros, salir sin aplicar
      if (!hasAnyFilter) {
        console.log('🚫 [usePropertyFilters] Primer render sin filtros, omitiendo búsqueda');
        return;
      }
    }

    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Crear nuevo timer
    debounceTimerRef.current = setTimeout(() => {
      console.log('⏱️ [usePropertyFilters] Aplicando filtros después de debounce');
      onFiltersApply(filters);
    }, debounceMs);

    // Cleanup: limpiar timer al desmontar
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    // Estado
    filters,
    showFilters,
    availableCities,

    // Funciones
    updateFilter,
    applyFiltersWithCategory,
    applyFiltersImmediately,
    resetFilters,
    toggleFiltersModal,

    // Utilidades
    hasActiveFilters,
    countActiveFilters,
  };
};
