import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { OwnerMaintenanceRequest, OwnerMaintenanceStats } from '../../../interfaces/owner/OwnerMaintenanceInterface';
import {
  acceptAndScheduleMaintenanceRequest,
  approveMaintenanceRequest,
  completeMaintenanceWork,
  createOwnerMaintenanceRequest,
  getOwnerMaintenanceRequests,
  rejectMaintenanceRequest,
  reviewMaintenanceRequest,
  scheduleMaintenanceWork
} from '../../../libs/owner/maintenance/api-service';
import { hapticFeedback } from '../../../utils/haptics';

interface UseOwnerMaintenanceRequestsReturn {
  // Estado
  requests: OwnerMaintenanceRequest[];
  loading: boolean;
  refreshing: boolean;
  processing: boolean;
  creating: boolean;
  error: string | null;

  // Estados derivados
  pendingCount: number;
  inReviewCount: number;
  approvedCount: number;
  inProgressCount: number;
  completedCount: number;
  rejectedCount: number;
  stats: OwnerMaintenanceStats;

  // Funciones
  loadRequests: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // Acciones del owner
  createRequest: (data: {
    id_property: string;
    id_owner: string;
    id_user: string;
    title: string;
    description: string;
    responsibility: 'owner' | 'user';
    scheduled_date: string; // OBLIGATORIO para escenario 2
    cost_estimate?: number;
  }) => Promise<boolean>;
  reviewRequest: (requestId: string, notes?: string) => Promise<boolean>;
  acceptAndSchedule: (requestId: string, scheduledDate: string, estimatedCost?: number) => Promise<boolean>;
  approveRequest: (requestId: string, estimatedCost?: number, scheduledDate?: string, notes?: string) => Promise<boolean>;
  rejectRequest: (requestId: string, notes: string) => Promise<boolean>;
  scheduleWork: (requestId: string, scheduledDate: string, estimatedCost?: number, notes?: string) => Promise<boolean>;
  completeWork: (requestId: string, actualCost?: number, notes?: string) => Promise<boolean>;
}

/**
 * Hook personalizado para gestionar las solicitudes de mantenimiento desde la perspectiva del owner
 */
export const useOwnerMaintenanceRequests = (): UseOwnerMaintenanceRequestsReturn => {
  const [requests, setRequests] = useState<OwnerMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todas las solicitudes
   */
  const loadRequests = useCallback(async () => {
    try {
      console.log('🔧 [useOwnerMaintenanceRequests] Cargando solicitudes...');
      
      const response = await getOwnerMaintenanceRequests();

      if (response.success) {
        console.log('✅ [useOwnerMaintenanceRequests] Solicitudes cargadas:', response.data.length);
        // Ordenar por fecha de creación (más recientes primero)
        const sortedRequests = response.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRequests(sortedRequests);
        setError(null);
        hapticFeedback.success();
      } else {
        console.log('⚠️ [useOwnerMaintenanceRequests] Error al cargar:', response.message);
        setRequests([]);
        setError(response.message || null);
        hapticFeedback.error();
      }
    } catch (err) {
      console.error('❌ [useOwnerMaintenanceRequests] Error crítico:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes');
      setRequests([]);
      hapticFeedback.error();
    }
  }, []);

  /**
   * Refrescar datos
   */
  const refresh = useCallback(async () => {
    console.log('🔄 [useOwnerMaintenanceRequests] Refrescando...');
    setRefreshing(true);
    hapticFeedback.refresh();
    await loadRequests();
    setRefreshing(false);
  }, [loadRequests]);

  /**
   * Crear nueva solicitud de mantenimiento como owner (Escenario 2)
   */
  const createRequest = useCallback(async (data: {
    id_property: string;
    id_owner: string;
    id_user: string;
    title: string;
    description: string;
    responsibility: 'owner' | 'user';
    scheduled_date: string; // OBLIGATORIO para escenario 2
    cost_estimate?: number;
  }): Promise<boolean> => {
    try {
      setCreating(true);
      console.log('➕ [useOwnerMaintenanceRequests] Creando solicitud como owner');
      console.log('📋 Datos:', data);
      
      hapticFeedback.buttonPress();
      
      const response = await createOwnerMaintenanceRequest(data);
      
      if (response.success) {
        console.log('✅ Solicitud creada:', response.data.id_maintenance);
        
        setError(null);
        hapticFeedback.success();
        
        // Recargar lista
        await loadRequests();
        
        Alert.alert(
          'Solicitud Creada',
          'La solicitud de mantenimiento ha sido creada exitosamente.',
          [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
        );
        
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al crear solicitud de mantenimiento');
      return false;
    } finally {
      setCreating(false);
    }
  }, [loadRequests]);

  /**
   * Marcar solicitud como en revisión
   */
  const reviewRequest = useCallback(async (
    requestId: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      console.log('🔍 [useOwnerMaintenanceRequests] Marcando como en revisión:', requestId);
      
      const response = await reviewMaintenanceRequest(requestId, notes);
      
      if (response.success) {
        console.log('✅ Solicitud en revisión');
        hapticFeedback.success();
        await loadRequests(); // Recargar lista
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al marcar solicitud en revisión');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [loadRequests]);

  /**
   * Aceptar y programar solicitud (Paso 3)
   */
  const acceptAndSchedule = useCallback(async (
    requestId: string,
    scheduledDate: string,
    estimatedCost?: number
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      console.log('✅ [useOwnerMaintenanceRequests] Aceptando y programando solicitud:', requestId);
      
      const response = await acceptAndScheduleMaintenanceRequest(requestId, scheduledDate, estimatedCost);
      
      if (response.success) {
        console.log('✅ Solicitud aceptada y programada');
        hapticFeedback.success();
        await loadRequests();
        Alert.alert('Éxito', 'Solicitud aceptada y programada correctamente');
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al aceptar y programar solicitud');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [loadRequests]);

  /**
   * Aprobar solicitud (legacy - ahora usa accepted)
   */
  const approveRequest = useCallback(async (
    requestId: string,
    estimatedCost?: number,
    scheduledDate?: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      console.log('✅ [useOwnerMaintenanceRequests] Aprobando solicitud:', requestId);
      
      const response = await approveMaintenanceRequest(requestId, estimatedCost, scheduledDate, notes);
      
      if (response.success) {
        console.log('✅ Solicitud aprobada');
        hapticFeedback.success();
        await loadRequests();
        Alert.alert('Éxito', 'Solicitud aprobada correctamente');
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al aprobar solicitud');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [loadRequests]);

  /**
   * Rechazar solicitud
   */
  const rejectRequest = useCallback(async (
    requestId: string,
    notes: string
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      console.log('❌ [useOwnerMaintenanceRequests] Rechazando solicitud:', requestId);
      
      const response = await rejectMaintenanceRequest(requestId, notes);
      
      if (response.success) {
        console.log('✅ Solicitud rechazada');
        hapticFeedback.success();
        await loadRequests();
        Alert.alert('Éxito', 'Solicitud rechazada');
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al rechazar solicitud');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [loadRequests]);

  /**
   * Programar trabajo
   */
  const scheduleWork = useCallback(async (
    requestId: string,
    scheduledDate: string,
    estimatedCost?: number,
    notes?: string
  ): Promise<boolean> => {
    try {
      setProcessing(true);
      console.log('📅 [useOwnerMaintenanceRequests] Programando trabajo:', requestId);
      
      const response = await scheduleMaintenanceWork(requestId, scheduledDate, estimatedCost, notes);
      
      if (response.success) {
        console.log('✅ Trabajo programado');
        hapticFeedback.success();
        await loadRequests();
        Alert.alert('Éxito', 'Trabajo programado correctamente');
        return true;
      } else {
        console.log('❌ Error:', response.message);
        hapticFeedback.error();
        Alert.alert('Error', response.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error crítico:', err);
      hapticFeedback.error();
      Alert.alert('Error', 'Error al programar trabajo');
      return false;
    } finally {
      setProcessing(false);
    }
  }, [loadRequests]);

  /**
   * Completar trabajo (Paso 5)
   */
  const completeWork = useCallback(async (
    requestId: string,
    actualCost?: number,
    notes?: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Completar Trabajo',
        '¿Confirmas que el trabajo de mantenimiento ha sido completado?',
        [
          {
            text: 'No',
            style: 'cancel',
            onPress: () => {
              hapticFeedback.buttonPressLight();
              resolve(false);
            },
          },
          {
            text: 'Sí, Completar',
            onPress: async () => {
              try {
                setProcessing(true);
                console.log('✅ [useOwnerMaintenanceRequests] Completando trabajo:', requestId);
                
                hapticFeedback.buttonPress();
                
                const response = await completeMaintenanceWork(requestId, actualCost, notes);
                
                if (response.success) {
                  console.log('✅ Trabajo completado');
                  hapticFeedback.success();
                  await loadRequests();
                  Alert.alert('Éxito', 'Trabajo completado correctamente', [
                    { text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }
                  ]);
                  resolve(true);
                } else {
                  console.log('❌ Error:', response.message);
                  hapticFeedback.error();
                  Alert.alert('Error', response.message);
                  resolve(false);
                }
              } catch (err) {
                console.error('❌ Error crítico:', err);
                hapticFeedback.error();
                Alert.alert('Error', 'Error al completar trabajo');
                resolve(false);
              } finally {
                setProcessing(false);
              }
            },
          },
        ]
      );
    });
  }, [loadRequests]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadRequests();
      setLoading(false);
    };

    initialize();
  }, [loadRequests]);

  // === ESTADOS DERIVADOS ===

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inReviewCount = requests.filter(r => r.status === 'in_review').length;
  const approvedCount = requests.filter(r => r.status === 'approved' || r.status === 'accepted').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  /**
   * Calcular tiempo promedio de respuesta (en horas)
   */
  const calculateAverageResponseTime = (): number => {
    const respondedRequests = requests.filter(r => 
      r.status !== 'pending' && r.status !== 'in_review'
    );
    
    if (respondedRequests.length === 0) return 0;
    
    const totalHours = respondedRequests.reduce((sum, request) => {
      // Simulación: en producción usarías un campo real de fecha de respuesta
      return sum + 24; // Promedio de 24 horas
    }, 0);
    
    return totalHours / respondedRequests.length;
  };

  /**
   * Calcular costo promedio
   */
  const calculateAverageCost = (): number => {
    const completedWithCost = requests.filter(r => 
      r.status === 'completed' && r.cost_estimate
    );
    
    if (completedWithCost.length === 0) return 0;
    
    const totalCost = completedWithCost.reduce((sum, request) => 
      sum + (request.cost_estimate || 0), 0
    );
    
    return totalCost / completedWithCost.length;
  };

  const stats: OwnerMaintenanceStats = {
    total: requests.length,
    pending: pendingCount,
    inReview: inReviewCount,
    approved: approvedCount,
    inProgress: inProgressCount,
    completed: completedCount,
    rejected: rejectedCount,
    averageResponseTime: calculateAverageResponseTime(),
    averageCost: calculateAverageCost(),
  };

  return {
    // Estado
    requests,
    loading,
    refreshing,
    processing,
    creating,
    error,

    // Estados derivados
    pendingCount,
    inReviewCount,
    approvedCount,
    inProgressCount,
    completedCount,
    rejectedCount,
    stats,

    // Funciones
    loadRequests,
    refresh,
    
    // Acciones
    createRequest,
    reviewRequest,
    acceptAndSchedule,
    approveRequest,
    rejectRequest,
    scheduleWork,
    completeWork,
  };
};
