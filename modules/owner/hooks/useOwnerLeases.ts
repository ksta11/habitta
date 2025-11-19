import { useCallback, useEffect, useState } from 'react';
import { OwnerLease, OwnerLeasesStats } from '../../../interfaces/owner/OwnerLeaseInterface';
import { getExpiringLeases, getOwnerLeases } from '../../../libs/owner/lease/api-service';
import { hapticFeedback } from '../../../utils/haptics';

interface UseOwnerLeasesReturn {
  // Estado
  leases: OwnerLease[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // Estados derivados
  activeLeasesCount: number;
  totalMonthlyIncome: number;
  expiringLeasesCount: number;
  stats: OwnerLeasesStats;

  // Funciones
  loadLeases: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para manejar los arrendamientos del owner
 * El owner puede tener múltiples leases activos (uno por cada propiedad arrendada)
 */
export const useOwnerLeases = (): UseOwnerLeasesReturn => {
  const [leases, setLeases] = useState<OwnerLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los arrendamientos del owner
   */
  const loadLeases = useCallback(async () => {
    try {
      console.log('🏠 [useOwnerLeases] Cargando arrendamientos...');
      
      const response = await getOwnerLeases();

      if (response.success) {
        console.log('✅ [useOwnerLeases] Arrendamientos cargados:', response.data.length);
        setLeases(response.data);
        setError(null);
      } else {
        console.log('⚠️ [useOwnerLeases] Error al cargar:', response.message);
        setLeases([]);
        setError(response.message || null);
      }
    } catch (err) {
      console.error('❌ [useOwnerLeases] Error crítico:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar arrendamientos');
      setLeases([]);
      hapticFeedback.error();
    }
  }, []);

  /**
   * Refrescar datos
   */
  const refresh = useCallback(async () => {
    console.log('🔄 [useOwnerLeases] Refrescando datos...');
    setRefreshing(true);
    hapticFeedback.refresh();
    await loadLeases();
    setRefreshing(false);
  }, [loadLeases]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadLeases();
      setLoading(false);
    };

    initialize();
  }, [loadLeases]);

  // === ESTADOS DERIVADOS ===

  /**
   * Cantidad de leases activos
   */
  const activeLeasesCount = leases.filter(lease => lease.status === 'active').length;

  /**
   * Ingreso mensual total de todos los leases activos
   */
  const totalMonthlyIncome = leases
    .filter(lease => lease.status === 'active')
    .reduce((sum, lease) => sum + lease.monthly_rent, 0);

  /**
   * Leases que expiran en los próximos 30 días
   */
  const expiringLeasesCount = leases.filter(lease => {
    if (lease.status !== 'active') return false;
    const endDate = new Date(lease.end_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate <= thirtyDaysFromNow && endDate >= now;
  }).length;

  /**
   * Estadísticas globales
   */
  const stats: OwnerLeasesStats = {
    total: leases.length,
    active: activeLeasesCount,
    pendingRenewal: leases.filter(l => l.status === 'pending_renewal').length,
    completed: leases.filter(l => l.status === 'completed').length,
    totalMonthlyIncome,
    occupancyRate: 0, // Se calculará con el total de propiedades
    averageRent: activeLeasesCount > 0 ? totalMonthlyIncome / activeLeasesCount : 0,
    upcomingExpirations: expiringLeasesCount,
  };

  return {
    // Estado
    leases,
    loading,
    refreshing,
    error,

    // Estados derivados
    activeLeasesCount,
    totalMonthlyIncome,
    expiringLeasesCount,
    stats,

    // Funciones
    loadLeases,
    refresh,
  };
};
