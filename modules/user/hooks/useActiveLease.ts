import { useCallback, useEffect, useState } from 'react';
import { Lease, LeaseDocument, PaymentHistory } from '../../../interfaces/LeaseInterface';
import { getActiveLease, getLeaseDocuments, getLeasePaymentHistory } from '../../../libs/user/lease/api-service';
import { hapticFeedback } from '../../../utils/haptics';

interface UseActiveLeaseReturn {
  // Estado
  lease: Lease | null;
  documents: LeaseDocument[];
  paymentHistory: PaymentHistory[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // Estados derivados
  hasActiveLease: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  nextPaymentDate: Date | null;

  // Funciones
  loadLease: () => Promise<void>;
  loadDocuments: () => Promise<void>;
  loadPaymentHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para manejar el arrendamiento activo del usuario
 */
export const useActiveLease = (): UseActiveLeaseReturn => {
  const [lease, setLease] = useState<Lease | null>(null);
  const [documents, setDocuments] = useState<LeaseDocument[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar arrendamiento activo
   */
  const loadLease = useCallback(async () => {
    try {
      console.log('📋 [useActiveLease] Cargando arrendamiento activo...');
      
      const response = await getActiveLease();

      if (response.success && response.data) {
        console.log('✅ [useActiveLease] Arrendamiento cargado:', response.data.id);
        setLease(response.data);
        setError(null);
        
        // Cargar documentos y historial de pagos si existe el lease
        if (response.data.id) {
          await Promise.all([
            loadDocuments(response.data.id),
            loadPaymentHistory(response.data.id),
          ]);
        }
      } else {
        console.log('ℹ️ [useActiveLease] No hay arrendamiento activo');
        setLease(null);
        setError(response.message || null);
      }
    } catch (err) {
      console.error('❌ [useActiveLease] Error al cargar arrendamiento:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar arrendamiento');
      // Feedback háptico de error
      hapticFeedback.error();
    }
  }, []);

  /**
   * Cargar documentos del arrendamiento
   */
  const loadDocuments = useCallback(async (leaseId?: string) => {
    try {
      const id = leaseId || lease?.id;
      if (!id) {
        console.log('⚠️ [useActiveLease] No hay ID de arrendamiento para cargar documentos');
        return;
      }

      console.log('📄 [useActiveLease] Cargando documentos del arrendamiento...');
      
      const response = await getLeaseDocuments(id);

      if (response.success) {
        console.log(`✅ [useActiveLease] ${response.data.length} documentos cargados`);
        setDocuments(response.data);
      } else {
        console.log('❌ [useActiveLease] Error al cargar documentos:', response.message);
        setDocuments([]);
      }
    } catch (err) {
      console.error('❌ [useActiveLease] Error al cargar documentos:', err);
      setDocuments([]);
    }
  }, [lease?.id]);

  /**
   * Cargar historial de pagos
   */
  const loadPaymentHistory = useCallback(async (leaseId?: string) => {
    try {
      const id = leaseId || lease?.id;
      if (!id) {
        console.log('⚠️ [useActiveLease] No hay ID de arrendamiento para cargar pagos');
        return;
      }

      console.log('💰 [useActiveLease] Cargando historial de pagos...');
      
      const response = await getLeasePaymentHistory(id);

      if (response.success) {
        console.log(`✅ [useActiveLease] ${response.data.length} pagos cargados`);
        setPaymentHistory(response.data);
      } else {
        console.log('❌ [useActiveLease] Error al cargar pagos:', response.message);
        setPaymentHistory([]);
      }
    } catch (err) {
      console.error('❌ [useActiveLease] Error al cargar pagos:', err);
      setPaymentHistory([]);
    }
  }, [lease?.id]);

  /**
   * Refrescar todos los datos
   */
  const refresh = useCallback(async () => {
    console.log('🔄 [useActiveLease] Refrescando datos...');
    setRefreshing(true);
    
    // Feedback háptico de refresco
    hapticFeedback.refresh();
    
    await loadLease();
    setRefreshing(false);
  }, [loadLease]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadLease();
      setLoading(false);
    };

    initialize();
  }, [loadLease]);

  // === ESTADOS DERIVADOS ===

  /**
   * Verificar si tiene arrendamiento activo
   */
  const hasActiveLease = lease !== null && lease.status === 'active';

  /**
   * Calcular días restantes del contrato
   */
  const daysRemaining = lease
    ? Math.ceil(
        (new Date(lease.end_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  /**
   * Verificar si está por expirar (menos de 30 días)
   */
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;

  /**
   * Calcular próxima fecha de pago
   */
  const nextPaymentDate = lease
    ? (() => {
        const today = new Date();
        const paymentDay = lease.payment_day;
        const nextMonth = new Date(
          today.getFullYear(),
          today.getMonth() + (today.getDate() > paymentDay ? 1 : 0),
          paymentDay
        );
        return nextMonth;
      })()
    : null;

  return {
    // Estado
    lease,
    documents,
    paymentHistory,
    loading,
    refreshing,
    error,

    // Estados derivados
    hasActiveLease,
    isExpiringSoon,
    daysRemaining,
    nextPaymentDate,

    // Funciones
    loadLease,
    loadDocuments,
    loadPaymentHistory,
    refresh,
  };
};
