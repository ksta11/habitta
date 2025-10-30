import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminProperty } from '../../../interfaces/property/PropertyInterface';
import { getAllProperties } from '../../../libs/admin/api-service';

interface PropertyStats {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle: string;
}

/**
 * Hook para manejar la lógica de gestión de propiedades del administrador
 * @returns Estado y funciones para manejar propiedades
 */
export const usePropertiesManagement = () => {
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  
  // Estados para la gestión de datos de la API
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener propiedades de la API
   */
  const fetchProperties = useCallback(async () => {
    try {
      console.log('🏠 [usePropertiesManagement] Obteniendo propiedades...');
      setLoading(true);
      setError(null);
      
      const response = await getAllProperties();
      
      if (response.success && response.data) {
        console.log('✅ [usePropertiesManagement] Propiedades obtenidas:', response.data.length);
        setProperties(response.data);
      } else {
        console.error('❌ [usePropertiesManagement] Error al obtener propiedades:', response.message);
        setError(response.message || 'Error al cargar propiedades');
      }
    } catch (err) {
      console.error('💥 [usePropertiesManagement] Error en fetchProperties:', err);
      setError('Error de conexión al cargar propiedades');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar propiedades al montar el componente
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  /**
   * Estadísticas calculadas de propiedades
   */
  const propertyStats = useMemo((): PropertyStats[] => {
    const total = properties.length;
    const available = properties.filter(p => p.status === 'available').length;
    const occupied = properties.filter(p => p.status === 'occupied').length;
    const maintenance = properties.filter(p => p.status === 'maintenance').length;
    const pending = properties.filter(p => p.status === 'pending').length;
    const totalRevenue = properties
      .filter(p => p.status === 'occupied')
      .reduce((sum, p) => sum + (p.rental_price || 0), 0);
  
    return [
      { 
        title: 'Total Propiedades', 
        value: total.toString(), 
        icon: 'building', 
        color: '#3b82f6',
        subtitle: 'Propiedades registradas'
      },
      { 
        title: 'Disponibles', 
        value: available.toString(), 
        icon: 'check-circle', 
        color: '#10b981',
        subtitle: 'Listas para alquilar'
      },
      { 
        title: 'Ocupadas', 
        value: occupied.toString(), 
        icon: 'users', 
        color: '#8b5cf6',
        subtitle: 'Generando ingresos'
      },
      { 
        title: 'Ingresos Mensuales', 
        value: `€${totalRevenue.toLocaleString()}`, 
        icon: 'euro', 
        color: '#f59e0b',
        subtitle: 'De propiedades ocupadas'
      }
    ];
  }, [properties]);

  /**
   * Propiedades filtradas
   */
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        (property.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (property.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (property.owner_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'todos' || property.type === filterType;
      const matchesStatus = filterStatus === 'todos' || property.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [properties, searchTerm, filterType, filterStatus]);

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilterType('todos');
    setFilterStatus('todos');
    setSearchTerm('');
  }, []);

  /**
   * Cambiar tipo de filtro
   */
  const cycleFilterType = useCallback(() => {
    setFilterType(prev => {
      if (prev === 'todos') return 'Apartamento';
      if (prev === 'Apartamento') return 'Casa';
      if (prev === 'Casa') return 'Estudio';
      return 'todos';
    });
  }, []);

  /**
   * Cambiar estado de filtro
   */
  const cycleFilterStatus = useCallback(() => {
    setFilterStatus(prev => {
      if (prev === 'todos') return 'available';
      if (prev === 'available') return 'occupied';
      if (prev === 'occupied') return 'maintenance';
      if (prev === 'maintenance') return 'pending';
      return 'todos';
    });
  }, []);

  return {
    // Estado
    properties,
    loading,
    error,
    searchTerm,
    filterType,
    filterStatus,
    filteredProperties,
    propertyStats,
    
    // Funciones
    fetchProperties,
    clearFilters,
    cycleFilterType,
    cycleFilterStatus,
    setSearchTerm,
    setFilterType,
    setFilterStatus,
  };
};
