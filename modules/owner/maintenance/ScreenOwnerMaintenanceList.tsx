import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import AcceptMaintenanceModal from '../../../components/molecules/AcceptMaintenanceModal';
import CompleteMaintenanceModal from '../../../components/molecules/CompleteMaintenanceModal';
import OwnerMaintenanceRequestCard from '../../../components/molecules/OwnerMaintenanceRequestCard';
import { OwnerMaintenanceFilter } from '../../../interfaces/owner/OwnerMaintenanceInterface';
import { hapticFeedback } from '../../../utils/haptics';
import { useOwnerMaintenanceRequests } from '../hooks';

export default function ScreenOwnerMaintenanceList() {
  const router = useRouter();
  const {
    requests,
    loading,
    refreshing,
    pendingCount,
    inReviewCount,
    inProgressCount,
    completedCount,
    refresh,
    acceptAndSchedule,
    rejectRequest,
    completeWork,
  } = useOwnerMaintenanceRequests();

  const [activeFilter, setActiveFilter] = useState<OwnerMaintenanceFilter>('all');
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{ 
    id: string; 
    title: string;
    estimatedCost?: number;
    scheduledDate?: string;
  } | null>(null);

  // Filtrar solicitudes según el filtro activo
  const filteredRequests = requests.filter(request => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return request.status === 'pending';
    if (activeFilter === 'in_review') return request.status === 'in_review';
    if (activeFilter === 'approved') return request.status === 'approved';
    if (activeFilter === 'in_progress') return request.status === 'in_progress';
    if (activeFilter === 'completed') return request.status === 'completed';
    if (activeFilter === 'rejected') return request.status === 'rejected';
    return true;
  });

  const handleFilterChange = (filter: OwnerMaintenanceFilter) => {
    hapticFeedback.selection();
    setActiveFilter(filter);
  };

  const handleRequestPress = (requestId: string) => {
    hapticFeedback.buttonPressLight();
    router.push(`/(owner)/(leases)/maintenance/${requestId}`);
  };

  const handleApprove = (requestId: string) => {
    hapticFeedback.buttonPress();
    const request = requests.find(r => r.id_maintenance === requestId);
    if (request) {
      setSelectedRequest({
        id: request.id_maintenance,
        title: request.title,
        estimatedCost: request.cost_estimate ?? undefined,
        scheduledDate: request.scheduled_date ?? undefined,
      });
      setAcceptModalVisible(true);
    }
  };

  const handleAcceptMaintenance = async (scheduledDate: string, estimatedCost?: number) => {
    if (!selectedRequest) return;
    
    const success = await acceptAndSchedule(selectedRequest.id, scheduledDate, estimatedCost);
    if (success) {
      setAcceptModalVisible(false);
      setSelectedRequest(null);
    }
  };

  const handleComplete = (requestId: string) => {
    hapticFeedback.buttonPress();
    const request = requests.find(r => r.id_maintenance === requestId);
    if (request) {
      setSelectedRequest({
        id: request.id_maintenance,
        title: request.title,
        estimatedCost: request.cost_estimate ?? undefined,
        scheduledDate: request.scheduled_date ?? undefined,
      });
      setCompleteModalVisible(true);
    }
  };

  const handleCompleteWork = async (actualCost?: number) => {
    if (!selectedRequest) return;
    
    const success = await completeWork(selectedRequest.id, actualCost);
    if (success) {
      setCompleteModalVisible(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = (requestId: string) => {
    hapticFeedback.buttonPress();
    // TODO: Mostrar modal para agregar notas de rechazo
    rejectRequest(requestId, 'No se puede realizar el mantenimiento en este momento');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white-traffic">
        {/* Header */}
        <View className="bg-lavender-indigo p-6 pt-12">
          <Text className="text-white-traffic text-2xl font-semibold">
            Solicitudes de Mantenimiento
          </Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#531A99" />
          <Text className="text-gray-500 mt-4">Cargando solicitudes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white-traffic">
      {/* Header con Stats */}
      <View className="bg-lavender-indigo p-6 pt-12">
        <Text className="text-white-traffic text-2xl font-semibold mb-4">
          Solicitudes de Mantenimiento
        </Text>

        {/* Stats Cards */}
        <View className="flex-row">
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3 mr-2">
            <Text className="text-white-traffic/80 text-xs mb-1">Pendientes</Text>
            <Text className="text-white-traffic font-bold text-2xl">
              {pendingCount}
            </Text>
          </View>
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3 mr-2">
            <Text className="text-white-traffic/80 text-xs mb-1">En Progreso</Text>
            <Text className="text-white-traffic font-bold text-2xl">
              {inProgressCount}
            </Text>
          </View>
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3">
            <Text className="text-white-traffic/80 text-xs mb-1">Completadas</Text>
            <Text className="text-white-traffic font-bold text-2xl">
              {completedCount}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={['#531A99']}
            tintColor="#531A99"
          />
        }
      >
        {filteredRequests.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center mb-2">
              No hay solicitudes {activeFilter !== 'all' && `con estado "${activeFilter}"`}
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              {activeFilter === 'pending' && 'Las nuevas solicitudes aparecerán aquí'}
              {activeFilter === 'completed' && 'Las solicitudes completadas aparecerán aquí'}
              {activeFilter === 'all' && 'No tienes solicitudes de mantenimiento'}
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <OwnerMaintenanceRequestCard
              key={request.id_maintenance}
              request={request}
              onPress={handleRequestPress}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
              showActions={true}
            />
          ))
        )}
      </ScrollView>

      {/* Modal para aceptar y programar */}
      <AcceptMaintenanceModal
        visible={acceptModalVisible}
        onClose={() => {
          setAcceptModalVisible(false);
          setSelectedRequest(null);
        }}
        onAccept={handleAcceptMaintenance}
        maintenanceTitle={selectedRequest?.title || ''}
      />

      {/* Modal para completar trabajo */}
      <CompleteMaintenanceModal
        visible={completeModalVisible}
        onClose={() => {
          setCompleteModalVisible(false);
          setSelectedRequest(null);
        }}
        onComplete={handleCompleteWork}
        maintenanceTitle={selectedRequest?.title || ''}
        estimatedCost={selectedRequest?.estimatedCost}
        scheduledDate={selectedRequest?.scheduledDate}
      />
    </View>
  );
}
