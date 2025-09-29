import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminStatsGrid, PropTechCharts } from '../../components/admin';

export default function AdminDashboard() {

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header del dashboard */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Dashboard Administrativo
          </Text>
          <Text className="text-gray-600">
            Métricas completas y análisis detallado de la plataforma
          </Text>
        </View>

        {/* Estadísticas completas */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Métricas Generales
          </Text>
          <AdminStatsGrid 
            variant="full"
          />
        </View>

        {/* Actividad Reciente */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Actividad Reciente
          </Text>
          <View className="bg-gray-50 rounded-lg p-8 items-center">
            <FontAwesome name="clock-o" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">
              Actividad reciente disponible próximamente
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Funcionalidad en desarrollo
            </Text>
          </View>
        </View>

        {/* Gráficos y métricas avanzadas PropTech */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Analytics PropTech
          </Text>
          <PropTechCharts />
        </View>

        {/* Gráficos y métricas adicionales */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Tendencias y Análisis
          </Text>
          <View className="bg-gray-50 rounded-lg p-8 items-center">
            <FontAwesome name="bar-chart" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">
              Más análisis disponibles
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Datos actualizados en tiempo real
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}