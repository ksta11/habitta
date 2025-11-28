import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  CreateMaintenanceRequestDTO,
  MaintenanceRequest
} from '../../../interfaces/MaintenanceInterface';
import {
  cancelMaintenanceRequest,
  confirmMaintenanceRequest,
  createMaintenanceRequest,
  getLeaseMaintenanceRequests,
  getMaintenanceRequests
} from '../../../libs/user/maintenance/api-service';
import { hapticFeedback } from '../../../utils/haptics';

interface UseMaintenanceRequestsReturn {
  // Estado
  requests: MaintenanceRequest[];
  loading: boolean;
  refreshing: boolean;
  creating: boolean;
  error: string | null;

  // Estados derivados
  pendingCount: number;
  acceptedCount: number;
  confirmedCount: number;
  inProgressCount: number;
  completedCount: number;

  // Funciones
  loadRequests: (leaseId?: string) => Promise<void>;
  createRequest: (data: CreateMaintenanceRequestDTO) => Promise<boolean>;
  confirmRequest: (requestId: string) => Promise<boolean>;
  cancelRequest: (requestId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para manejar solicitudes de mantenimiento
 */
export const useMaintenanceRequests = (leaseId?: string): UseMaintenanceRequestsReturn => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar solicitudes de mantenimiento
   */
  const loadRequests = useCallback(async (specificLeaseId?: string) => {
    try {
      console.log('🔧 [useMaintenanceRequests] Cargando solicitudes...');
      
      const id = specificLeaseId || leaseId;
      const response = id
        ? await getLeaseMaintenanceRequests(id)
        : await getMaintenanceRequests();

      if (response.success) {
        console.log(`✅ [useMaintenanceRequests] ${response.data.length} solicitudes cargadas`);
        
        // Ordenar por fecha de creación (más reciente primero)
        const sortedRequests = [...response.data].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setRequests(sortedRequests);
        setError(null);
        
        // Feedback háptico de éxito
        hapticFeedback.success();
      } else {
        console.log('❌ [useMaintenanceRequests] Error al cargar solicitudes:', response.message);
        setRequests([]);
        setError(response.message || 'Error al cargar solicitudes');
        
        // Feedback háptico de error
        hapticFeedback.error();
      }
    } catch (err) {
      console.error('❌ [useMaintenanceRequests] Error al cargar solicitudes:', err);
      setRequests([]);
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes');
      
      // Feedback háptico de error
      hapticFeedback.error();
    }
  }, [leaseId]);

  /**
   * Crear nueva solicitud de mantenimiento
   */
  const createRequest = useCallback(async (data: CreateMaintenanceRequestDTO): Promise<boolean> => {
    try {
      console.log('🔧 [useMaintenanceRequests] Creando solicitud...');
      console.log('📋 Datos:', data);
      
      setCreating(true);
      
      const response = await createMaintenanceRequest(data);

      if (response.success) {
        console.log('✅ [useMaintenanceRequests] Solicitud creada:', response.data.id_maintenance);
        
        // Agregar la nueva solicitud al inicio de la lista
        setRequests(prev => [response.data, ...prev]);
        setError(null);
        
        // Feedback háptico de éxito
        hapticFeedback.success();
        
        // Mostrar mensaje de éxito
        Alert.alert(
          'Solicitud Creada',
          'Tu solicitud de mantenimiento ha sido enviada al propietario.',
          [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
        );
        
        return true;
      } else {
        console.log('❌ [useMaintenanceRequests] Error al crear solicitud:', response.message);
        setError(response.message || 'Error al crear solicitud');
        
        // Feedback háptico de error
        hapticFeedback.error();
        
        // Mostrar mensaje de error
        Alert.alert(
          'Error',
          response.message || 'No se pudo crear la solicitud. Intenta nuevamente.',
          [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
        );
        
        return false;
      }
    } catch (err) {
      console.error('❌ [useMaintenanceRequests] Error al crear solicitud:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
      setError(errorMessage);
      
      // Feedback háptico de error
      hapticFeedback.error();
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
      );
      
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  /**
   * Confirmar solicitud de mantenimiento (Paso 4)
   */
  const confirmRequest = useCallback(async (requestId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Confirmar Fecha',
        '¿Confirmas la fecha programada para el mantenimiento?',
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
            text: 'Sí, Confirmar',
            onPress: async () => {
              try {
                console.log('✅ [useMaintenanceRequests] Confirmando solicitud:', requestId);
                
                hapticFeedback.buttonPress();
                
                const response = await confirmMaintenanceRequest(requestId);

                if (response.success) {
                  console.log('✅ [useMaintenanceRequests] Solicitud confirmada');
                  
                  // Actualizar estado de la solicitud en la lista
                  setRequests(prev =>
                    prev.map(req =>
                      req.id_maintenance === requestId
                        ? { ...req, status: 'confirmed', confirmed_date: new Date().toISOString() }
                        : req
                    )
                  );
                  
                  setError(null);
                  hapticFeedback.success();
                  
                  Alert.alert(
                    'Fecha Confirmada',
                    'Has confirmado la fecha del mantenimiento.',
                    [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                  );
                  
                  resolve(true);
                } else {
                  console.log('❌ [useMaintenanceRequests] Error al confirmar:', response.message);
                  hapticFeedback.error();
                  
                  Alert.alert(
                    'Error',
                    response.message || 'No se pudo confirmar la solicitud.',
                    [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                  );
                  
                  resolve(false);
                }
              } catch (err) {
                console.error('❌ [useMaintenanceRequests] Error al confirmar:', err);
                hapticFeedback.error();
                
                Alert.alert(
                  'Error',
                  err instanceof Error ? err.message : 'Error inesperado',
                  [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                );
                
                resolve(false);
              }
            },
          },
        ]
      );
    });
  }, []);

  /**
   * Cancelar solicitud de mantenimiento
   */
  const cancelRequest = useCallback(async (requestId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Cancelar Solicitud',
        '¿Estás seguro de que quieres cancelar esta solicitud de mantenimiento?',
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
            text: 'Sí, Cancelar',
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('🔧 [useMaintenanceRequests] Cancelando solicitud:', requestId);
                
                // Feedback háptico de acción destructiva
                hapticFeedback.buttonPress();
                
                const response = await cancelMaintenanceRequest(requestId);

                if (response.success) {
                  console.log('✅ [useMaintenanceRequests] Solicitud cancelada');
                  
                  // Actualizar estado de la solicitud en la lista
                  setRequests(prev =>
                    prev.map(req =>
                      req.id_maintenance === requestId
                        ? { ...req, status: 'cancelled' }
                        : req
                    )
                  );
                  
                  setError(null);
                  
                  // Feedback háptico de éxito
                  hapticFeedback.success();
                  
                  Alert.alert(
                    'Solicitud Cancelada',
                    'La solicitud de mantenimiento ha sido cancelada.',
                    [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                  );
                  
                  resolve(true);
                } else {
                  console.log('❌ [useMaintenanceRequests] Error al cancelar:', response.message);
                  
                  // Feedback háptico de error
                  hapticFeedback.error();
                  
                  Alert.alert(
                    'Error',
                    response.message || 'No se pudo cancelar la solicitud.',
                    [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                  );
                  
                  resolve(false);
                }
              } catch (err) {
                console.error('❌ [useMaintenanceRequests] Error al cancelar:', err);
                
                // Feedback háptico de error
                hapticFeedback.error();
                
                Alert.alert(
                  'Error',
                  err instanceof Error ? err.message : 'Error inesperado',
                  [{ text: 'OK', onPress: () => hapticFeedback.buttonPressLight() }]
                );
                
                resolve(false);
              }
            },
          },
        ]
      );
    });
  }, []);

  /**
   * Refrescar solicitudes
   */
  const refresh = useCallback(async () => {
    console.log('🔄 [useMaintenanceRequests] Refrescando solicitudes...');
    setRefreshing(true);
    
    // Feedback háptico de refresco
    hapticFeedback.refresh();
    
    await loadRequests();
    setRefreshing(false);
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

  /**
   * Contador de solicitudes pendientes
   */
  const pendingCount = requests.filter(
    req => req.status === 'pending' || req.status === 'in_review'
  ).length;

  /**
   * Contador de solicitudes aceptadas (esperando confirmación)
   */
  const acceptedCount = requests.filter(
    req => req.status === 'accepted'
  ).length;

  /**
   * Contador de solicitudes confirmadas
   */
  const confirmedCount = requests.filter(
    req => req.status === 'confirmed'
  ).length;

  /**
   * Contador de solicitudes en progreso
   */
  const inProgressCount = requests.filter(
    req => req.status === 'in_progress' || req.status === 'approved'
  ).length;

  /**
   * Contador de solicitudes completadas
   */
  const completedCount = requests.filter(
    req => req.status === 'completed'
  ).length;

  return {
    // Estado
    requests,
    loading,
    refreshing,
    creating,
    error,

    // Estados derivados
    pendingCount,
    acceptedCount,
    confirmedCount,
    inProgressCount,
    completedCount,

    // Funciones
    loadRequests,
    createRequest,
    confirmRequest,
    cancelRequest,
    refresh,
  };
};
