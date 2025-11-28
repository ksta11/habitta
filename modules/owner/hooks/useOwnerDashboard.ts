import { useEffect, useState } from "react";
import { OwnerDashboard } from "../../../interfaces/OwnerDashboardInterface";
import { getOwnerIncome, getOwnerStats } from "../../../libs/owner/api-service";
import { hapticFeedback } from "../../../utils/haptics";

interface UseOwnerDashboardReturn {
  // Estado de datos
  statsData: OwnerDashboard | null;
  monthlyIncome: Array<{ month: string; amount: number }>;
  incomePeriod: '3months' | '6months' | '1year' | 'all';
  loading: boolean;
  incomeLoading: boolean;
  error: string | null;
  incomeError: string | null;

  // Datos formateados para UI
  totalProperties: number;
  pendingApplications: number;
  scheduledMaintenances: number;
  lastMonthIncome: number;
  recentApplications: any[];
  occupiedVsTotal: { occupied: number; total: number };

  // Funciones
  loadOwnerStats: () => Promise<void>;
  loadOwnerIncome: (period?: '3months' | '6months' | '1year' | 'all') => Promise<void>;
  setIncomePeriod: (period: '3months' | '6months' | '1year' | 'all') => void;
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
  const [monthlyIncome, setMonthlyIncome] = useState<Array<{ month: string; amount: number }>>([]);
  const [incomePeriod, setIncomePeriod] = useState<'3months' | '6months' | '1year' | 'all'>('6months');
  const [loading, setLoading] = useState(true);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeError, setIncomeError] = useState<string | null>(null);

  // === FUNCIONES ===

  /**
   * Carga las estadísticas del propietario desde el backend (sin ingresos)
   * - Obtiene datos del dashboard (propiedades, aplicaciones)
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
        hapticFeedback.success();
        setStatsData(response);
        console.log("✅ Estadísticas cargadas exitosamente:", response.data);
      } else {
        hapticFeedback.error();
        setError(response.message);
        console.error("❌ Error al cargar estadísticas:", response.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      hapticFeedback.error();
      setError(errorMessage);
      console.error("💥 Error crítico:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga los ingresos del propietario por período
   * - Obtiene datos de ingresos mensuales
   * - Maneja estados de loading y error específicos para ingresos
   */
  const loadOwnerIncome = async (period: '3months' | '6months' | '1year' | 'all' = '6months') => {
    try {
      setIncomeLoading(true);
      setIncomeError(null);
      console.log(`💰 Cargando ingresos del período: ${period}...`);

      const response = await getOwnerIncome(period);

      if (response.success) {
        hapticFeedback.success();
        setMonthlyIncome(response.data);
        setIncomePeriod(period);
        console.log(`✅ Ingresos cargados exitosamente para ${period}:`, response.data);
      } else {
        hapticFeedback.error();
        setIncomeError(response.message);
        console.error("❌ Error al cargar ingresos:", response.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      hapticFeedback.error();
      setIncomeError(errorMessage);
      console.error("💥 Error crítico al cargar ingresos:", errorMessage);
    } finally {
      setIncomeLoading(false);
    }
  };

  /**
   * Cambia el período de ingresos y recarga los datos
   */
  const changeIncomePeriod = (period: '3months' | '6months' | '1year' | 'all') => {
    setIncomePeriod(period);
    loadOwnerIncome(period);
  };

  /**
   * Recarga las estadísticas (útil para pull-to-refresh)
   * Alias de loadOwnerStats para mayor claridad semántica
   */
  const refreshStats = async () => {
    hapticFeedback.refresh();
    await loadOwnerStats();
    await loadOwnerIncome(incomePeriod);
  };

  // === CARGA INICIAL ===
  useEffect(() => {
    const loadInitialData = async () => {
      await loadOwnerStats();
      await loadOwnerIncome('6months'); // Período por defecto
    };
    loadInitialData();
  }, []);

  // === DATOS FORMATEADOS PARA UI ===
  const totalProperties = statsData?.data.totalProperties || 0;
  const pendingApplications = statsData?.data.pendingApplications || 0;
  const scheduledMaintenances = statsData?.data.scheduledMaintenances || 0;
  const rentedProperties = statsData?.data.rentedProperties || 0;

  // Calcular ingresos del último mes desde el estado separado
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
    monthlyIncome,
    incomePeriod,
    loading,
    incomeLoading,
    error,
    incomeError,

    // Datos formateados para UI
    totalProperties,
    pendingApplications,
    scheduledMaintenances,
    lastMonthIncome,
    recentApplications,
    occupiedVsTotal,

    // Funciones
    loadOwnerStats,
    loadOwnerIncome,
    setIncomePeriod: changeIncomePeriod,
    refreshStats,
  };
};
