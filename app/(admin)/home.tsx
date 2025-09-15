import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminStatsGrid } from '../../components/admin';
import { PropTechCharts } from '../../components/admin/PropTechCharts';

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
          <AdminStatsGrid variant="full" />
        </View>

        {/* Secciones adicionales del dashboard */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Actividad Reciente
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <FontAwesome name="user-plus" size={16} color="#3b82f6" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Nuevo usuario registrado</Text>
                <Text className="text-gray-500 text-sm">Ana García se registró como inquilina</Text>
              </View>
              <Text className="text-gray-400 text-xs">Hace 2h</Text>
            </View>
            
            <View className="flex-row items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <FontAwesome name="building" size={16} color="#10b981" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Nueva propiedad añadida</Text>
                <Text className="text-gray-500 text-sm">Apartamento en Madrid Centro</Text>
              </View>
              <Text className="text-gray-400 text-xs">Hace 4h</Text>
            </View>
            
            <View className="flex-row items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <FontAwesome name="exclamation-triangle" size={16} color="#f59e0b" />
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Usuario pendiente de aprobación</Text>
                <Text className="text-gray-500 text-sm">Carlos Rodríguez requiere verificación</Text>
              </View>
              <Text className="text-gray-400 text-xs">Hace 6h</Text>
            </View>
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