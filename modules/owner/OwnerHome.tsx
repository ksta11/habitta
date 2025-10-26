import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { DashboardHeader } from "./dashboard/dashboard-header";
import { QuickActions } from "./dashboard/quick-actions";
import { RecentApplications } from "./dashboard/recent-applications";
import { RevenueChart } from "./dashboard/revenue-chart";
import { StatsGrid } from "./dashboard/stats-grid";
import { useOwnerDashboard } from './hooks';

export default function Dashboard() {
  // === HOOK DE DASHBOARD DEL PROPIETARIO ===
  const {
    loading,
    error,
    totalProperties,
    pendingApplications,
    scheduledMaintenances,
    lastMonthIncome,
    monthlyIncome,
    recentApplications,
    loadOwnerStats,
  } = useOwnerDashboard();

  // Mostrar loading
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Cargando estadísticas...</Text>
      </View>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-4">
        <Text className="text-red-600 text-center text-lg mb-4">
          Error al cargar las estadísticas
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          {error}
        </Text>
        <Text 
          className="text-blue-600 text-center underline"
          onPress={loadOwnerStats}
        >
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
            <View className="px-4 py-6">
                <DashboardHeader />
                <View className="mt-6">
                    <StatsGrid 
                      totalProperties={totalProperties}
                      pendingApplications={pendingApplications}
                      scheduledMaintenances={scheduledMaintenances}
                      lastMonthIncome={lastMonthIncome}
                    />
                </View>
                <View>
                    <View className="mt-6">
                        <RevenueChart monthlyIncome={monthlyIncome} />
                    </View>
                    <View className="mt-6">
                        <RecentApplications applications={recentApplications} />
                    </View>
                    <View className="mt-6">
                        <QuickActions />
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
  )
}