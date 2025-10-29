import { useState, useEffect } from "react";
import { getOwnerStats } from "../../../libs/owner/api-service";
import { OwnerDashboard } from "../../../interfaces/OwnerDashboardInterface";

interface UseOwnerDashboardReturn {
  // Estado de datos
  statsData: OwnerDashboard | null;
  loading: boolean;
  error: string | null;

  // Datos formateados para UI
  totalProperties: number;
  pendingApplications: number;
  scheduledMaintenances: number;
  lastMonthIncome: number;
  monthlyIncome: Array<{ month: string; amount: number }>;
  recentApplications: any[];
  occupiedVsTotal: { occupied: number; total: number };

  // Funciones
  loadOwnerStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

/**
 * 🏠 Hook personalizado para manejar el dashboard del propietario
 * 
 * Encapsula toda la lógica de:
 * - Carga de estadísticas del propietario
 * - Estado de loading y errores
 * - Formateo de datos para componentes de UI
 * - Recarga de datos (refresh)
 * - Cálculo de ingresos del último mes
 * 
 * @returns {UseOwnerDashboardReturn} Objeto con datos del dashboard, estado y handlers
 * 
 * @example
 * ```tsx
 * const {
 *   statsData,
 *   loading,
 *   error,
 *   totalProperties,
 *   pendingApplications,
 *   monthlyIncome,
 *   recentApplications,
 *   loadOwnerStats,
 *   refreshStats,
 * } = useOwnerDashboard();
 * ```
 */
export const useOwnerDashboard = (): UseOwnerDashboardReturn => {
  // === ESTADO LOCAL ===
  const [statsData, setStatsData] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === FUNCIONES ===

  /**
   * Carga las estadísticas del propietario desde el backend
   * - Obtiene datos del dashboard (propiedades, aplicaciones, ingresos)
   * - Maneja estados de loading y error
   * - Actualiza el estado con los datos recibidos
   */
  const loadOwnerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🏠 Cargando estadísticas del dashboard...");

      const response = await getOwnerStats();

      if (response.success) {
        setStatsData(response);
        console.log("✅ Estadísticas cargadas exitosamente:", response.data);
      } else {
        setError(response.message);
        console.error("❌ Error al cargar estadísticas:", response.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("💥 Error crítico:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarga las estadísticas (útil para pull-to-refresh)
   * Alias de loadOwnerStats para mayor claridad semántica
   */
  const refreshStats = async () => {
    await loadOwnerStats();
  };

  // === CARGA INICIAL ===
  useEffect(() => {
    loadOwnerStats();
  }, []);

  // === DATOS FORMATEADOS PARA UI ===
  const totalProperties = statsData?.data.totalProperties || 0;
  const pendingApplications = statsData?.data.pendingApplications || 0;
  const scheduledMaintenances = statsData?.data.scheduledMaintenances || 0;
  const rentedProperties = statsData?.data.rentedProperties || 0;

  // Calcular ingresos del último mes
  const monthlyIncome = statsData?.data.monthlyIncome || [];
  const lastMonthIncome =
    monthlyIncome.length > 0
      ? monthlyIncome[monthlyIncome.length - 1].amount
      : 0;

  const recentApplications = statsData?.data.recentApplications || [];

  // Formato de ocupados vs total
  const occupiedVsTotal = {
    occupied: rentedProperties,
    total: totalProperties,
  };

  // Debug logs
  console.log("📊 Dashboard Stats:", {
    totalProperties,
    pendingApplications,
    scheduledMaintenances,
    lastMonthIncome,
    monthlyIncomeCount: monthlyIncome.length,
    recentApplicationsCount: recentApplications.length,
    occupiedVsTotal,
  });

  // === RETURN ===
  return {
    // Estado de datos
    statsData,
    loading,
    error,

    // Datos formateados para UI
    totalProperties,
    pendingApplications,
    scheduledMaintenances,
    lastMonthIncome,
    monthlyIncome,
    recentApplications,
    occupiedVsTotal,

    // Funciones
    loadOwnerStats,
    refreshStats,
  };
};
