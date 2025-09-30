import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { DashboardHeader } from "../../modules/owner/dashboard/dashboard-header"
import { StatsGrid } from "../../modules/owner/dashboard/stats-grid"
import { RevenueChart } from "../../modules/owner/dashboard/revenue-chart"
import { RecentApplications } from "../../modules/owner/dashboard/recent-applications"
import { CurrentPlan } from "../../modules/owner/dashboard/current-plan"
import { QuickActions } from "../../modules/owner/dashboard/quick-actions"
import { getOwnerStats } from '../../libs/owner/api-service';
import { OwnerDashboard } from '../../interfaces/OwnerDashboardInterface';

export default function Dashboard() {
  const [statsData, setStatsData] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas del propietario
  const loadOwnerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏠 Cargando estadísticas del dashboard...');
      
      const response = await getOwnerStats();
      
      if (response.success) {
        setStatsData(response);
        console.log('✅ Estadísticas cargadas exitosamente:', response.data);
      } else {
        setError(response.message);
        console.error('❌ Error al cargar estadísticas:', response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('💥 Error crítico:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadOwnerStats();
  }, []);

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
  if (error || !statsData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-4">
        <Text className="text-red-600 text-center text-lg mb-4">
          Error al cargar las estadísticas
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          {error || 'No se pudieron obtener los datos'}
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
                      totalProperties={statsData.data.totalProperties}
                      pendingApplications={statsData.data.pendingApplications}
                      scheduledMaintenances={statsData.data.scheduledMaintenances}
                      lastMonthIncome={statsData.data.monthlyIncome.length > 0 ? 
                        statsData.data.monthlyIncome[statsData.data.monthlyIncome.length - 1].amount : 0
                      }
                    />
                </View>
                <View>
                    <View className="mt-6">
                        <RevenueChart monthlyIncome={statsData.data.monthlyIncome} />
                    </View>
                    <View className="mt-6">
                        <RecentApplications applications={statsData.data.recentApplications} />
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