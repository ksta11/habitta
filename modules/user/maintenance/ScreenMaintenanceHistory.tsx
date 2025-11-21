import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';
import MaintenanceRequestCard from '../../../components/molecules/MaintenanceRequestCard';
import { MaintenanceStatus } from '../../../interfaces/MaintenanceInterface';
import { hapticFeedback } from '../../../utils/haptics';
import { useActiveLease, useMaintenanceRequests } from '../hooks';

type FilterType = 'all' | MaintenanceStatus;

export default function ScreenMaintenanceHistory() {
  const router = useRouter();
  const { lease } = useActiveLease();
  const {
    requests,
    loading,
    refreshing,
    pendingCount,
    inProgressCount,
    completedCount,
    cancelRequest,
    refresh,
  } = useMaintenanceRequests(lease?.id);

  const [filter, setFilter] = useState<FilterType>('all');

  /**
   * Filtrar solicitudes según el filtro seleccionado
   */
  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(req => req.status === filter);

  /**
   * Navegar a solicitar mantenimiento
   */
  const handleRequestMaintenance = () => {
    hapticFeedback.buttonPress();
    router.push('/(user)/(leases)/maintenance/request');
  };

  /**
   * Ver detalles de una solicitud
   */
  const handleViewDetails = (requestId: string) => {
    hapticFeedback.buttonPressLight();
    // TODO: Implementar vista de detalles
    console.log('Ver detalles de solicitud:', requestId);
  };

  /**
   * Cancelar solicitud
   */
  const handleCancelRequest = async (requestId: string) => {
    await cancelRequest(requestId);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#531A99" />
        <Text className="text-gray-600 mt-4">Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header Stats */}
      <View className="bg-violet px-4 pt-4 pb-6">
        <View className="mb-4">
          <Text className="text-white text-2xl font-bold">Mis Solicitudes</Text>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white/80 text-xs">Pendientes</Text>
            <Text className="text-white text-2xl font-bold">{pendingCount}</Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white/80 text-xs">En Progreso</Text>
            <Text className="text-white text-2xl font-bold">{inProgressCount}</Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white/80 text-xs">Completadas</Text>
            <Text className="text-white text-2xl font-bold">{completedCount}</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-4 border-b border-gray-200"
      >
        <Pressable
          onPress={() => {
            hapticFeedback.selection();
            setFilter('all');
          }}
          className={`px-4 py-2 rounded-xl mr-2 ${
            filter === 'all' ? 'bg-violet' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium ${
              filter === 'all' ? 'text-white' : 'text-erie-black'
            }`}
          >
            Todas ({requests.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            hapticFeedback.selection();
            setFilter('pending');
          }}
          className={`px-4 py-2 rounded-xl mr-2 ${
            filter === 'pending' ? 'bg-violet' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium ${
              filter === 'pending' ? 'text-white' : 'text-erie-black'
            }`}
          >
            Pendientes
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            hapticFeedback.selection();
            setFilter('in_progress');
          }}
          className={`px-4 py-2 rounded-xl mr-2 ${
            filter === 'in_progress' ? 'bg-violet' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium ${
              filter === 'in_progress' ? 'text-white' : 'text-erie-black'
            }`}
          >
            En Progreso
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            hapticFeedback.selection();
            setFilter('completed');
          }}
          className={`px-4 py-2 rounded-xl mr-2 ${
            filter === 'completed' ? 'bg-violet' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium ${
              filter === 'completed' ? 'text-white' : 'text-erie-black'
            }`}
          >
            Completadas
          </Text>
        </Pressable>
      </ScrollView>

      {/* Lista de Solicitudes */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={['#531A99']}
            tintColor="#531A99"
          />
        }
      >
        <View className="px-4 py-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <MaintenanceRequestCard
                key={request.id}
                request={request}
                onViewDetails={handleViewDetails}
                onCancel={handleCancelRequest}
                showPropertyInfo={!lease} // Mostrar info de propiedad si no hay lease específico
              />
            ))
          ) : (
            <View className="bg-gray-50 rounded-2xl p-8 items-center mt-8">
              <FontAwesome name="inbox" size={48} color="#9ca3af" />
              <Text className="text-gray-600 text-center mt-4 text-base">
                {filter === 'all'
                  ? 'No tienes solicitudes de mantenimiento'
                  : `No tienes solicitudes ${
                      filter === 'pending'
                        ? 'pendientes'
                        : filter === 'in_progress'
                        ? 'en progreso'
                        : 'completadas'
                    }`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón Flotante */}
      <View className="absolute bottom-6 right-6">
        <Pressable
          onPress={handleRequestMaintenance}
          className="w-16 h-16 bg-violet rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: '#531A99',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <FontAwesome name="plus" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
