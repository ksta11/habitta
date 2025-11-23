import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Label from '../../../components/atoms/Label';
import ConfirmMaintenanceModal from '../../../components/molecules/ConfirmMaintenanceModal';
import LeaseCard from '../../../components/molecules/LeaseCard';
import MaintenanceRequestCard from '../../../components/molecules/MaintenanceRequestCard';
import { hapticFeedback } from '../../../utils/haptics';
import { useActiveLease, useMaintenanceRequests } from '../hooks';

export default function ScreenLeases() {
  const router = useRouter();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    title: string;
    scheduledDate: string;
    estimatedCost?: number;
  } | null>(null);
  
  // Hook del arrendamiento activo
  const {
    lease,
    latestPayment,
    loading: leaseLoading,
    refreshing: leaseRefreshing,
    hasActiveLease,
    isExpiringSoon,
    daysRemaining,
    nextPaymentDate,
    shouldShowPaymentButton,
    paymentId,
    refresh: refreshLease,
  } = useActiveLease();

  // Hook de solicitudes de mantenimiento
  const {
    requests: maintenanceRequests,
    loading: maintenanceLoading,
    pendingCount,
    acceptedCount,
    confirmedCount,
    inProgressCount,
    confirmRequest,
    refresh: refreshMaintenance,
  } = useMaintenanceRequests(lease?.id);

  const loading = leaseLoading || maintenanceLoading;
  const refreshing = leaseRefreshing;

  /**
   * Refrescar todos los datos
   */
  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshLease(), refreshMaintenance()]);
  }, [refreshLease, refreshMaintenance]);

  /**
   * Refrescar datos cada vez que la pantalla gana foco
   */
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  /**
   * Navegar a solicitar mantenimiento
   */
  const handleRequestMaintenance = () => {
    hapticFeedback.buttonPress();
    router.push('/(user)/(leases)/maintenance/request');
  };

  /**
   * Navegar al historial de mantenimientos
   */
  const handleViewAllMaintenance = () => {
    hapticFeedback.buttonPressLight();
    router.push('/(user)/(leases)/maintenance');
  };

  /**
   * Ver detalles de una solicitud de mantenimiento
   */
  const handleViewMaintenanceDetails = (requestId: string) => {
    hapticFeedback.buttonPressLight();
    // TODO: Implementar vista de detalles
    console.log('Ver detalles de solicitud:', requestId);
  };

  /**
   * Confirmar fecha de mantenimiento
   */
  const handleConfirmMaintenance = (requestId: string) => {
    hapticFeedback.buttonPress();
    const request = maintenanceRequests.find(r => r.id_maintenance === requestId);
    if (request && request.scheduled_date) {
      setSelectedRequest({
        id: request.id_maintenance,
        title: request.title,
        scheduledDate: request.scheduled_date,
        estimatedCost: request.cost_estimate ?? undefined,
      });
      setConfirmModalVisible(true);
    }
  };

  /**
   * Ejecutar confirmación
   */
  const handleConfirmRequest = async () => {
    if (!selectedRequest) return;
    
    const success = await confirmRequest(selectedRequest.id);
    if (success) {
      setConfirmModalVisible(false);
      setSelectedRequest(null);
    }
  };

  /**
   * Abrir contrato
   */
  const handleViewContract = () => {
    if (lease?.contract_url) {
      hapticFeedback.buttonPressLight();
      Linking.openURL(lease.contract_url);
    }
  };

  /**
   * Ir a la pantalla de pago
   */
  const handleMakePayment = () => {
    if (paymentId) {
      hapticFeedback.buttonPress();
      router.push(`/(user)/(settings)/payment/make/${paymentId}`);
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#531A99" />
        <Text className="text-gray-600 mt-4">Cargando arrendamiento...</Text>
      </View>
    );
  }

  // Sin arrendamiento activo
  if (!hasActiveLease || !lease) {
    return (
      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#531A99']}
            tintColor="#531A99"
          />
        }
      >
        <View className="flex-1 justify-center items-center px-6 py-12">
          <View className="w-24 h-24 bg-violet/10 rounded-full items-center justify-center mb-6">
            <FontAwesome name="home" size={40} color="#531A99" />
          </View>
          <Label text="Sin Arrendamiento Activo" size="xl" weight="bold" />
          <Text className="text-gray-600 text-center mt-3 mb-6">
            Actualmente no tienes un contrato de arrendamiento activo. Explora propiedades y aplica para empezar.
          </Text>
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPress();
              router.push('/(user)/home');
            }}
            className="bg-violet rounded-xl py-4 px-8"
          >
            <Text className="text-white font-semibold text-base">Explorar Propiedades</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Obtener las últimas 3 solicitudes de mantenimiento
  const recentRequests = maintenanceRequests.slice(0, 3);

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#531A99']}
          tintColor="#531A99"
        />
      }
    >
      <View className="px-4 py-6">
        {/* Alerta de Expiración */}
        {isExpiringSoon && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 flex-row items-center">
            <FontAwesome name="exclamation-triangle" size={20} color="#f59e0b" />
            <View className="flex-1 ml-3">
              <Text className="text-yellow-800 font-semibold">Contrato por Expirar</Text>
              <Text className="text-yellow-700 text-sm mt-1">
                Tu contrato expira en {daysRemaining} días. Contacta a tu propietario para renovación.
              </Text>
            </View>
          </View>
        )}

        {/* Card del Arrendamiento */}
        <LeaseCard
          lease={lease}
          onViewContract={handleViewContract}
        />

        {/* Stats de Mantenimiento */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-yellow-50 rounded-2xl p-4">
            <FontAwesome name="clock-o" size={24} color="#f59e0b" />
            <Text className="text-2xl font-bold text-erie-black mt-2">{pendingCount}</Text>
            <Text className="text-gray-600 text-sm">Pendientes</Text>
          </View>
          <View className="flex-1 bg-purple-50 rounded-2xl p-4">
            <FontAwesome name="calendar-check-o" size={24} color="#7c3aed" />
            <Text className="text-2xl font-bold text-erie-black mt-2">{acceptedCount}</Text>
            <Text className="text-gray-600 text-sm">Por Confirmar</Text>
          </View>
          <View className="flex-1 bg-blue-50 rounded-2xl p-4">
            <FontAwesome name="wrench" size={24} color="#3b82f6" />
            <Text className="text-2xl font-bold text-erie-black mt-2">{confirmedCount + inProgressCount}</Text>
            <Text className="text-gray-600 text-sm">Activas</Text>
          </View>
        </View>

        {/* Botón Solicitar Mantenimiento */}
        <Pressable
          onPress={handleRequestMaintenance}
          className="bg-violet rounded-2xl p-4 mb-6 flex-row items-center justify-center"
        >
          <FontAwesome name="plus-circle" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Solicitar Mantenimiento
          </Text>
        </Pressable>

        {/* Solicitudes Recientes */}
        {recentRequests.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Label text="Solicitudes Recientes" size="lg" weight="bold" />
              {maintenanceRequests.length > 3 && (
                <Pressable onPress={handleViewAllMaintenance}>
                  <Text className="text-violet font-semibold">Ver Todas</Text>
                </Pressable>
              )}
            </View>

            {recentRequests.map((request) => (
              <MaintenanceRequestCard
                key={request.id_maintenance}
                request={request}
                onConfirm={handleConfirmMaintenance}
                onViewDetails={handleViewMaintenanceDetails}
              />
            ))}
          </View>
        )}

        {/* Sin Solicitudes */}
        {recentRequests.length === 0 && (
          <View className="bg-gray-50 rounded-2xl p-6 items-center mb-6">
            <FontAwesome name="wrench" size={40} color="#9ca3af" />
            <Text className="text-gray-600 text-center mt-3">
              No tienes solicitudes de mantenimiento
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-1">
              Solicita mantenimiento cuando lo necesites
            </Text>
          </View>
        )}

        {/* Información de Pago */}
        {nextPaymentDate && (
          <View className="bg-violet/5 rounded-2xl p-4 border border-violet/20">
            <View className="flex-row items-center mb-2">
              <FontAwesome 
                name={latestPayment?.status === 'completed' ? "check-circle" : "calendar"} 
                size={18} 
                color="#531A99" 
              />
              <Text className="text-violet font-semibold ml-2">
                {latestPayment?.status === 'completed' ? 'Alquiler al día' : 'Próximo Pago'}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-erie-black">
              ${lease.monthly_rent.toLocaleString()}
            </Text>
            {latestPayment?.status !== 'completed' && (
              <Text className="text-gray-600 mt-1">
                Fecha: {nextPaymentDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            )}
            {shouldShowPaymentButton && paymentId && (
              <Pressable
                onPress={handleMakePayment}
                className="bg-violet rounded-xl py-3 px-6 mt-4 items-center"
              >
                <Text className="text-white font-semibold">Pagar ahora</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Modal de Confirmación */}
      {selectedRequest && (
        <ConfirmMaintenanceModal
          visible={confirmModalVisible}
          onClose={() => {
            setConfirmModalVisible(false);
            setSelectedRequest(null);
          }}
          onConfirm={handleConfirmRequest}
          maintenanceTitle={selectedRequest.title}
          scheduledDate={selectedRequest.scheduledDate}
          estimatedCost={selectedRequest.estimatedCost}
        />
      )}
    </ScrollView>
  );
}
