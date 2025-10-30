import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { SolicitudFilters, SolicitudPropietario } from '../../../interfaces/SolicitudInterface';
import { getAllApplications } from '../../../libs/admin/api-service';

/**
 * Hook para manejar la lógica de solicitudes de propietarios
 * @returns Estado y funciones para manejar solicitudes
 */
export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudPropietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudPropietario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [filters, setFilters] = useState<SolicitudFilters>({
    search: '',
    estado: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
    tipo_documento: 'todos',
    sortBy: 'fecha_solicitud',
    sortOrder: 'desc'
  });

  /**
   * Carga las solicitudes desde el API
   */
  const loadSolicitudes = useCallback(async () => {
    try {
      console.log('🔄 [useSolicitudes] Cargando solicitudes desde el API...');
      setLoading(true);
      setError(null);
      
      const response = await getAllApplications();
      
      if (response.success && response.data) {
        console.log('✅ [useSolicitudes] Solicitudes cargadas exitosamente:', response.data.length);
        
        // Mapear los datos del API al formato esperado
        const mappedSolicitudes: SolicitudPropietario[] = response.data.map((app: any) => ({
          id: app.id,
          user_id: app.renter?.id || '',
          user_name: app.renter?.name || 'Usuario desconocido',
          user_email: app.renter?.email || '',
          user_phone: app.renter?.phone || '',
          estado: app.status || 'pendiente',
          fecha_solicitud: app.application_date || new Date().toISOString(),
          documentos: [],
          informacion_adicional: {
            experiencia_previa: false,
            propiedades_a_publicar: 1,
            motivo_solicitud: `Solicitud para propiedad: ${app.property?.title || 'Sin título'}`
          }
        }));
        
        setSolicitudes(mappedSolicitudes);
      } else {
        console.error('❌ [useSolicitudes] Error en la respuesta del API:', response.message);
        setError(response.message || 'Error al cargar las solicitudes');
      }
    } catch (err) {
      console.error('❌ [useSolicitudes] Error cargando solicitudes:', err);
      setError('Error de conexión al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Calcula las estadísticas de las solicitudes
   */
  const solicitudStats = useMemo(() => {
    const total = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const en_revision = solicitudes.filter(s => s.estado === 'en_revision').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'aprobada').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'rechazada').length;
    const incompletas = solicitudes.filter(s => s.estado === 'documentacion_incompleta').length;

    const tasa_aprobacion = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

    return {
      total,
      pendientes,
      en_revision,
      aprobadas,
      rechazadas,
      incompletas,
      tasa_aprobacion,
      stats: [
        { 
          title: 'Total Solicitudes', 
          value: total.toString(), 
          icon: 'file-text', 
          color: '#3b82f6',
          subtitle: 'Solicitudes recibidas'
        },
        { 
          title: 'Pendientes', 
          value: pendientes.toString(), 
          icon: 'clock-o', 
          color: '#f59e0b',
          subtitle: 'Esperando revisión'
        },
        { 
          title: 'En Revisión', 
          value: en_revision.toString(), 
          icon: 'eye', 
          color: '#8b5cf6',
          subtitle: 'Siendo evaluadas'
        },
        { 
          title: 'Tasa Aprobación', 
          value: `${tasa_aprobacion}%`, 
          icon: 'check-circle', 
          color: '#10b981',
          subtitle: 'Solicitudes aprobadas'
        }
      ]
    };
  }, [solicitudes]);

  /**
   * Filtra las solicitudes según los filtros aplicados
   */
  const filteredSolicitudes = useMemo(() => {
    let filtered = solicitudes.filter(solicitud => {
      const matchesSearch = solicitud.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          solicitud.user_email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesEstado = filters.estado === 'todos' || solicitud.estado === filters.estado;

      return matchesSearch && matchesEstado;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      
      if (filters.sortBy === 'fecha_solicitud') {
        const aDate = new Date(aVal as string).getTime();
        const bDate = new Date(bVal as string).getTime();
        return filters.sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (filters.sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [solicitudes, filters]);

  /**
   * Abre el modal de detalles de una solicitud
   */
  const handleOpenDetail = useCallback((solicitud: SolicitudPropietario) => {
    console.log('📋 [useSolicitudes] Abriendo detalles de solicitud:', solicitud.id);
    setSelectedSolicitud(solicitud);
    setModalVisible(true);
  }, []);

  /**
   * Cierra el modal de detalles
   */
  const handleCloseDetail = useCallback(() => {
    console.log('🚫 [useSolicitudes] Cerrando modal de detalles');
    setModalVisible(false);
    setSelectedSolicitud(null);
  }, []);

  /**
   * Maneja la aprobación de una solicitud
   */
  const handleAprobar = useCallback((solicitudId: string) => {
    console.log('✅ [useSolicitudes] Aprobando solicitud:', solicitudId);
    Alert.alert(
      "Aprobar Solicitud",
      "¿Estás seguro de que quieres aprobar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Aprobar", 
          style: "default",
          onPress: () => {
            // TODO: Implementar lógica para aprobar la solicitud
            Alert.alert("Éxito", "Solicitud aprobada correctamente");
            setModalVisible(false);
            loadSolicitudes();
          }
        }
      ]
    );
  }, [loadSolicitudes]);

  /**
   * Maneja el rechazo de una solicitud
   */
  const handleRechazar = useCallback((solicitudId: string) => {
    console.log('❌ [useSolicitudes] Rechazando solicitud:', solicitudId);
    Alert.alert(
      "Rechazar Solicitud",
      "¿Estás seguro de que quieres rechazar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Rechazar", 
          style: "destructive",
          onPress: () => {
            // TODO: Implementar lógica para rechazar la solicitud
            Alert.alert("Rechazada", "Solicitud rechazada");
            setModalVisible(false);
            loadSolicitudes();
          }
        }
      ]
    );
  }, [loadSolicitudes]);

  /**
   * Actualiza los filtros de búsqueda
   */
  const updateFilters = useCallback((newFilters: Partial<SolicitudFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Resetea todos los filtros
   */
  const resetFilters = useCallback(() => {
    console.log('🔄 [useSolicitudes] Reseteando filtros');
    setFilters({
      search: '',
      estado: 'todos',
      fecha_desde: '',
      fecha_hasta: '',
      tipo_documento: 'todos',
      sortBy: 'fecha_solicitud',
      sortOrder: 'desc'
    });
  }, []);

  /**
   * Formatea la fecha para mostrar
   */
  const formatFecha = useCallback((fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadSolicitudes();
  }, [loadSolicitudes]);

  return {
    // Estado
    solicitudes,
    filteredSolicitudes,
    loading,
    error,
    filters,
    selectedSolicitud,
    modalVisible,
    solicitudStats,
    
    // Funciones
    loadSolicitudes,
    handleOpenDetail,
    handleCloseDetail,
    handleAprobar,
    handleRechazar,
    updateFilters,
    resetFilters,
    formatFecha,
    
    // Setters
    setModalVisible,
  };
};
