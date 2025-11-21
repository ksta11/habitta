import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import OwnerLeaseCard from '../../../components/molecules/OwnerLeaseCard';
import { useOwnerLeases } from '../hooks';
import { hapticFeedback } from '../../../utils/haptics';

export default function ScreenOwnerLeases() {
  const router = useRouter();
  const {
    leases,
    loading,
    refreshing,
    activeLeasesCount,
    totalMonthlyIncome,
    expiringLeasesCount,
    refresh,
  } = useOwnerLeases();

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLeasePress = (leaseId: string) => {
    hapticFeedback.buttonPressLight();
    // TODO: Navegar a detalle del lease
    console.log('Ver detalle del lease:', leaseId);
  };

  const handleViewMaintenance = () => {
    hapticFeedback.buttonPress();
    router.push('/(owner)/(leases)/maintenance');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white-traffic">
        {/* Header */}
        <View className="bg-lavender-indigo p-6 pt-12">
          <Text className="text-white-traffic text-2xl font-semibold">
            Mis Arrendamientos
          </Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#531A99" />
          <Text className="text-gray-500 mt-4">Cargando arrendamientos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white-traffic">
      {/* Header con Stats */}
      <View className="bg-lavender-indigo p-6 pt-12">
        <Text className="text-white-traffic text-2xl font-semibold mb-4">
          Mis Arrendamientos
        </Text>

        {/* Stats Cards */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3 mr-2">
            <Text className="text-white-traffic/80 text-xs mb-1">Activos</Text>
            <Text className="text-white-traffic font-bold text-2xl">
              {activeLeasesCount}
            </Text>
          </View>
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3 mr-2">
            <Text className="text-white-traffic/80 text-xs mb-1">Ingreso Mensual</Text>
            <Text className="text-white-traffic font-bold text-lg">
              {formatCurrency(totalMonthlyIncome)}
            </Text>
          </View>
          <View className="flex-1 bg-white-traffic/20 rounded-xl p-3">
            <Text className="text-white-traffic/80 text-xs mb-1">Por Expirar</Text>
            <Text className="text-white-traffic font-bold text-2xl">
              {expiringLeasesCount}
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
        {/* Botón para ver Solicitudes de Mantenimiento */}
        <View 
          className="bg-violet rounded-xl p-4 mb-4 flex-row items-center justify-between active:opacity-80"
          onTouchEnd={handleViewMaintenance}
        >
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-1">
              Solicitudes de Mantenimiento
            </Text>
            <Text className="text-white/80 text-sm">
              Ver todas las solicitudes de tus inquilinos
            </Text>
          </View>
          <Text className="text-white text-2xl ml-3">→</Text>
        </View>

        {/* Botón para crear Mantenimiento como Owner */}
        <View 
          className="bg-green-600 rounded-xl p-4 mb-4 flex-row items-center justify-between active:opacity-80"
          onTouchEnd={() => {
            hapticFeedback.buttonPress();
            router.push('/(owner)/(leases)/maintenance/create');
          }}
        >
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-1">
              + Crear Mantenimiento
            </Text>
            <Text className="text-white/80 text-sm">
              Programar mantenimiento preventivo o reparación
            </Text>
          </View>
          <Text className="text-white text-2xl ml-3">+</Text>
        </View>

        {leases.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center mb-2">
              No tienes arrendamientos activos
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Cuando tus propiedades sean arrendadas, aparecerán aquí
            </Text>
          </View>
        ) : (
          <>
            {/* Alerta de Expiraciones */}
            {expiringLeasesCount > 0 && (
              <View className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <Text className="text-orange-700 font-semibold mb-1">
                  ⚠️ {expiringLeasesCount} {expiringLeasesCount === 1 ? 'contrato' : 'contratos'} próximo{expiringLeasesCount === 1 ? '' : 's'} a expirar
                </Text>
                <Text className="text-orange-600 text-sm">
                  Revisa los contratos que expiran en los próximos 30 días
                </Text>
              </View>
            )}

            {/* Lista de Leases */}
            {leases.map((lease) => (
              <OwnerLeaseCard
                key={lease.id}
                lease={lease}
                onPress={handleLeasePress}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
