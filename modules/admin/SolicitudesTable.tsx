import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSolicitudes } from '../../modules/admin/hooks';
import { AdminStatsGrid } from './AdminStatsGrid';
import { StatusBadge } from './Atoms';
import { DocumentList } from './Molecules';
import { FilterPanel, SolicitudCard } from './Organisms';

export const SolicitudesTable: React.FC = () => {
  const {
    solicitudes,
    filteredSolicitudes,
    loading,
    error,
    filters,
    selectedSolicitud,
    modalVisible,
    solicitudStats,
    loadSolicitudes,
    handleOpenDetail,
    handleCloseDetail,
    handleAprobar,
    handleRechazar,
    updateFilters,
    resetFilters,
    formatFecha,
    setModalVisible,
  } = useSolicitudes();

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
          <AdminStatsGrid variant="custom" customStats={solicitudStats.stats} />
        </View>

        {/* Filtros */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Filtros y Búsqueda
          </Text>
          
          <FilterPanel
            searchPlaceholder="Buscar por nombre o email..."
            searchValue={filters.search}
            onSearchChange={(text) => updateFilters({ search: text })}
            filters={[
              {
                label: 'Solo Pendientes',
                value: 'pendiente',
                active: filters.estado === 'pendiente',
                onPress: () => updateFilters({ estado: 'pendiente' }),
              },
              {
                label: 'En Revisión',
                value: 'en_revision',
                active: filters.estado === 'en_revision',
                onPress: () => updateFilters({ estado: 'en_revision' }),
              },
              {
                label: 'Aprobadas',
                value: 'aprobada',
                active: filters.estado === 'aprobada',
                onPress: () => updateFilters({ estado: 'aprobada' }),
              },
            ]}
            onClearFilters={resetFilters}
            showClearButton={filters.estado !== '' || filters.search !== ''}
          />
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
                <SolicitudCard
                  key={solicitud.id}
                  solicitud={solicitud}
                  onView={handleOpenDetail}
                  formatFecha={formatFecha}
                />
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
          onRequestClose={handleCloseDetail}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
              {selectedSolicitud && (
                <>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-gray-800">
                      Detalles de Solicitud
                    </Text>
                    <Pressable onPress={handleCloseDetail}>
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

                    <StatusBadge status={selectedSolicitud.estado} variant="solicitud" />

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

                    <DocumentList 
                      documentos={selectedSolicitud.documentos.map(doc => ({
                        id: doc.id,
                        tipo: doc.tipo,
                        verificado: doc.verificado,
                      }))}
                      title="Documentos"
                    />

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
