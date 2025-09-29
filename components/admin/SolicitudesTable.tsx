import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminStatsGrid } from './AdminStatsGrid';
import { 
  SolicitudPropietario, 
  SolicitudFilters, 
  SolicitudDocumento,
  EstadisticasSolicitudes 
} from '../../interfaces/SolicitudInterface';
import { getAllApplications } from '../../libs/admin/api-service';



// Componente Badge para estado de solicitud
interface EstadoBadgeProps {
  estado: SolicitudPropietario['estado'];
}

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  const getEstadoConfig = (estado: SolicitudPropietario['estado']) => {
    switch (estado) {
      case 'pendiente':
        return { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: 'clock-o' };
      case 'en_revision':
        return { text: 'En Revisión', className: 'bg-blue-100 text-blue-800', icon: 'eye' };
      case 'aprobada':
        return { text: 'Aprobada', className: 'bg-green-100 text-green-800', icon: 'check-circle' };
      case 'rechazada':
        return { text: 'Rechazada', className: 'bg-red-100 text-red-800', icon: 'times-circle' };
      case 'documentacion_incompleta':
        return { text: 'Doc. Incompleta', className: 'bg-orange-100 text-orange-800', icon: 'file-text' };
      default:
        return { text: estado, className: 'bg-gray-100 text-gray-800', icon: 'question' };
    }
  };

  const config = getEstadoConfig(estado);
  
  return (
    <View className={`flex-row items-center px-2 py-1 rounded-full ${config.className}`}>
      <FontAwesome name={config.icon as any} size={10} color={config.className.includes('yellow') ? '#d97706' : 
                                                                config.className.includes('blue') ? '#2563eb' :
                                                                config.className.includes('green') ? '#059669' :
                                                                config.className.includes('red') ? '#dc2626' :
                                                                config.className.includes('orange') ? '#ea580c' : '#6b7280'} />
      <Text className={`text-xs font-medium ml-1 ${config.className.split(' ')[1]}`}>
        {config.text}
      </Text>
    </View>
  );
};

// Componente para mostrar documentos
interface DocumentosListProps {
  documentos: SolicitudDocumento[];
}

const DocumentosList: React.FC<DocumentosListProps> = ({ documentos }) => {
  const getTipoDocumento = (tipo: SolicitudDocumento['tipo']) => {
    const tipos = {
      'dni': 'DNI/NIE',
      'pasaporte': 'Pasaporte',
      'certificado_ingresos': 'Cert. Ingresos',
      'declaracion_renta': 'Decl. Renta',
      'certificado_bancario': 'Cert. Bancario',
      'otros': 'Otros'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <View className="mt-2">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Documentos ({documentos.length})
      </Text>
      <View className="flex-row flex-wrap gap-1">
        {documentos.map((doc) => (
          <View 
            key={doc.id} 
            className={`flex-row items-center px-2 py-1 rounded text-xs ${
              doc.verificado ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <FontAwesome 
              name={doc.verificado ? 'check' : 'file-o'} 
              size={10} 
              color={doc.verificado ? '#059669' : '#6b7280'} 
            />
            <Text className={`text-xs ml-1 ${
              doc.verificado ? 'text-green-800' : 'text-gray-600'
            }`}>
              {getTipoDocumento(doc.tipo)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const SolicitudesTable: React.FC = () => {
  const [filters, setFilters] = useState<SolicitudFilters>({
    search: '',
    estado: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
    tipo_documento: 'todos',
    sortBy: 'fecha_solicitud',
    sortOrder: 'desc'
  });

  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudPropietario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para manejo de datos reales
  const [solicitudes, setSolicitudes] = useState<SolicitudPropietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar solicitudes desde el API
  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando solicitudes desde el API...');
      const response = await getAllApplications();
      
      if (response.success && response.data) {
        console.log('✅ Solicitudes cargadas exitosamente:', response.data.length);
        // Mapear los datos del API al formato esperado por el componente
        const mappedSolicitudes: SolicitudPropietario[] = response.data.map((app: any) => ({
          id: app.id,
          user_id: app.renter?.id || '',
          user_name: app.renter?.name || 'Usuario desconocido',
          user_email: app.renter?.email || '',
          user_phone: app.renter?.phone || '',
          estado: app.status || 'pendiente',
          fecha_solicitud: app.application_date || new Date().toISOString(),
          documentos: [], // Los documentos se manejarían por separado si es necesario
          informacion_adicional: {
            experiencia_previa: false,
            propiedades_a_publicar: 1,
            motivo_solicitud: `Solicitud para propiedad: ${app.property?.title || 'Sin título'}`
          }
        }));
        
        setSolicitudes(mappedSolicitudes);
      } else {
        console.error('❌ Error en la respuesta del API:', response.message);
        setError(response.message || 'Error al cargar las solicitudes');
      }
    } catch (err) {
      console.error('❌ Error cargando solicitudes:', err);
      setError('Error de conexión al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadSolicitudes();
  }, []);

  // Estadísticas calculadas
  const solicitudStats = useMemo(() => {
    const total = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const en_revision = solicitudes.filter(s => s.estado === 'en_revision').length;
    const aprobadas = solicitudes.filter(s => s.estado === 'aprobada').length;
    const rechazadas = solicitudes.filter(s => s.estado === 'rechazada').length;
    const incompletas = solicitudes.filter(s => s.estado === 'documentacion_incompleta').length;

    const tasa_aprobacion = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

    return [
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
    ];
  }, [solicitudes]);

  // Filtrado de solicitudes
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
  }, [filters]);

  const handleAprobar = (solicitudId: string) => {
    Alert.alert(
      "Aprobar Solicitud",
      "¿Estás seguro de que quieres aprobar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Aprobar", 
          style: "default",
          onPress: () => {
            // Aquí iría la lógica para aprobar la solicitud
            Alert.alert("Éxito", "Solicitud aprobada correctamente");
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const handleRechazar = (solicitudId: string) => {
    Alert.alert(
      "Rechazar Solicitud",
      "¿Estás seguro de que quieres rechazar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Rechazar", 
          style: "destructive",
          onPress: () => {
            // Aquí iría la lógica para rechazar la solicitud
            Alert.alert("Rechazada", "Solicitud rechazada");
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Solicitudes de Propietarios
          </Text>
          <Text className="text-gray-600">
            Gestiona las solicitudes para convertirse en propietario
          </Text>
        </View>

        {/* Estadísticas */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Estadísticas de Solicitudes
          </Text>
          <AdminStatsGrid variant="custom" customStats={solicitudStats} />
        </View>

        {/* Filtros */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Filtros y Búsqueda
          </Text>
          
          {/* Barra de búsqueda */}
          <View className="relative mb-4">
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-gray-800"
              placeholder="Buscar por nombre o email..."
              value={filters.search}
              onChangeText={(text) => setFilters(prev => ({ ...prev, search: text }))}
            />
            <FontAwesome 
              name="search" 
              size={16} 
              color="#6b7280" 
              style={{ position: 'absolute', left: 12, top: 12 }}
            />
          </View>

          {/* Filtros por estado */}
          <View className="flex-row flex-wrap gap-2">
            <Pressable 
              className="bg-yellow-100 px-3 py-1 rounded-full"
              onPress={() => setFilters(prev => ({ ...prev, estado: 'pendiente' }))}
            >
              <Text className="text-yellow-800 text-sm font-medium">Solo Pendientes</Text>
            </Pressable>
            <Pressable 
              className="bg-blue-100 px-3 py-1 rounded-full"
              onPress={() => setFilters(prev => ({ ...prev, estado: 'en_revision' }))}
            >
              <Text className="text-blue-800 text-sm font-medium">En Revisión</Text>
            </Pressable>
            <Pressable 
              className="bg-green-100 px-3 py-1 rounded-full"
              onPress={() => setFilters(prev => ({ ...prev, estado: 'aprobada' }))}
            >
              <Text className="text-green-800 text-sm font-medium">Aprobadas</Text>
            </Pressable>
            <Pressable 
              className="bg-gray-100 px-3 py-1 rounded-full"
              onPress={() => setFilters({
                search: '',
                estado: 'todos',
                fecha_desde: '',
                fecha_hasta: '',
                tipo_documento: 'todos',
                sortBy: 'fecha_solicitud',
                sortOrder: 'desc'
              })}
            >
              <Text className="text-gray-800 text-sm font-medium">Limpiar Filtros</Text>
            </Pressable>
          </View>
        </View>

        {/* Lista de solicitudes */}
        <View className="bg-white rounded-lg shadow-sm">
          <View className="p-6 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                Solicitudes ({filteredSolicitudes.length})
              </Text>
              {loading && (
                <View className="flex-row items-center">
                  <FontAwesome name="spinner" size={16} color="#3b82f6" />
                  <Text className="text-blue-600 text-sm ml-2">Cargando...</Text>
                </View>
              )}
            </View>
          </View>

          <View className="p-6">
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <View className="flex-row items-center">
                  <FontAwesome name="exclamation-triangle" size={16} color="#dc2626" />
                  <Text className="text-red-800 text-sm ml-2 flex-1">{error}</Text>
                  <Pressable 
                    className="bg-red-100 px-3 py-1 rounded"
                    onPress={loadSolicitudes}
                  >
                    <Text className="text-red-800 text-xs font-medium">Reintentar</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {loading && filteredSolicitudes.length === 0 ? (
              <View className="items-center py-12">
                <FontAwesome name="spinner" size={48} color="#3b82f6" />
                <Text className="text-gray-600 mt-4 text-center">
                  Cargando solicitudes...
                </Text>
              </View>
            ) : (
              filteredSolicitudes.map((solicitud) => (
              <Pressable
                key={solicitud.id}
                className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                onPress={() => {
                  setSelectedSolicitud(solicitud);
                  setModalVisible(true);
                }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 mr-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                      {solicitud.user_name}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-2">
                      {solicitud.user_email}
                    </Text>
                    <View className="flex-row items-center mb-2">
                      <FontAwesome name="calendar" size={12} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        Solicitado: {formatFecha(solicitud.fecha_solicitud)}
                      </Text>
                    </View>
                  </View>
                  <EstadoBadge estado={solicitud.estado} />
                </View>

                <DocumentosList documentos={solicitud.documentos} />

                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-sm text-gray-600">
                    <Text className="font-medium">Propiedades a publicar:</Text> {solicitud.informacion_adicional.propiedades_a_publicar}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    <Text className="font-medium">Experiencia previa:</Text> {solicitud.informacion_adicional.experiencia_previa ? 'Sí' : 'No'}
                  </Text>
                </View>

                <View className="flex-row justify-end mt-3">
                  <Pressable className="bg-blue-100 px-3 py-1 rounded">
                    <Text className="text-blue-800 text-sm font-medium">Ver Detalles</Text>
                  </Pressable>
                </View>
              </Pressable>
              ))
            )}

            {filteredSolicitudes.length === 0 && !loading && (
              <View className="items-center py-12">
                <FontAwesome name="file-text" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">
                  No se encontraron solicitudes
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-2">
                  Prueba ajustando los filtros de búsqueda
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Modal de detalles */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
              {selectedSolicitud && (
                <>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-gray-800">
                      Detalles de Solicitud
                    </Text>
                    <Pressable onPress={() => setModalVisible(false)}>
                      <FontAwesome name="times" size={20} color="#6b7280" />
                    </Pressable>
                  </View>

                  <ScrollView className="max-h-96">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedSolicitud.user_name}
                    </Text>
                    <Text className="text-gray-600 mb-4">
                      {selectedSolicitud.user_email}
                    </Text>

                    <EstadoBadge estado={selectedSolicitud.estado} />

                    <View className="mt-4">
                      <Text className="font-medium text-gray-800 mb-2">Motivo de la solicitud:</Text>
                      <Text className="text-gray-600 text-sm mb-4">
                        {selectedSolicitud.informacion_adicional.motivo_solicitud}
                      </Text>
                    </View>

                    {selectedSolicitud.informacion_adicional.referencias && (
                      <View className="mb-4">
                        <Text className="font-medium text-gray-800 mb-2">Referencias:</Text>
                        <Text className="text-gray-600 text-sm">
                          {selectedSolicitud.informacion_adicional.referencias}
                        </Text>
                      </View>
                    )}

                    <DocumentosList documentos={selectedSolicitud.documentos} />

                    {selectedSolicitud.comentarios_admin && (
                      <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <Text className="font-medium text-gray-800 mb-2">Comentarios del Admin:</Text>
                        <Text className="text-gray-600 text-sm">
                          {selectedSolicitud.comentarios_admin}
                        </Text>
                      </View>
                    )}
                  </ScrollView>

                  {(selectedSolicitud.estado === 'pendiente' || selectedSolicitud.estado === 'en_revision') && (
                    <View className="flex-row mt-6">
                      <Pressable 
                        className="flex-1 bg-green-600 py-3 rounded-lg mr-2"
                        onPress={() => handleAprobar(selectedSolicitud.id)}
                      >
                        <Text className="text-white text-center font-medium">Aprobar</Text>
                      </Pressable>
                      <Pressable 
                        className="flex-1 bg-red-600 py-3 rounded-lg ml-2"
                        onPress={() => handleRechazar(selectedSolicitud.id)}
                      >
                        <Text className="text-white text-center font-medium">Rechazar</Text>
                      </Pressable>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};
