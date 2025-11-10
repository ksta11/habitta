import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import { ChartContainer } from './Molecules';

const { width } = Dimensions.get('window');
const chartWidth = width - 40; // Padding de 20 a cada lado

// Mock data para gráficos PropTech
const mockChartData = {
  // Ocupación mensual de propiedades (últimos 6 meses)
  occupancyRate: [
    { value: 85, label: 'Jul' },
    { value: 88, label: 'Ago' },
    { value: 92, label: 'Sep' },
    { value: 89, label: 'Oct' },
    { value: 94, label: 'Nov' },
    { value: 96, label: 'Dic' }
  ],

  // Ingresos mensuales (últimos 6 meses)
  monthlyRevenue: [
    { value: 45, label: 'Jul' },
    { value: 48, label: 'Ago' },
    { value: 52, label: 'Sep' },
    { value: 49, label: 'Oct' },
    { value: 55, label: 'Nov' },
    { value: 58, label: 'Dic' }
  ],

  // Distribución por tipo de propiedad
  propertyTypes: [
    { value: 65, text: '65%', color: '#3b82f6', label: 'Apartamentos' },
    { value: 25, text: '25%', color: '#10b981', label: 'Casas' },
    { value: 8, text: '8%', color: '#f59e0b', label: 'Estudios' },
    { value: 2, text: '2%', color: '#ef4444', label: 'Locales' }
  ],

  // Tiempo promedio de alquiler (días para alquilar)
  averageRentalTime: [
    { value: 15, label: 'Centro' },
    { value: 22, label: 'Norte' },
    { value: 18, label: 'Sur' },
    { value: 28, label: 'Este' },
    { value: 20, label: 'Oeste' }
  ],

  // Satisfacción de inquilinos
  tenantSatisfaction: [
    { value: 4.2, label: 'Jul' },
    { value: 4.3, label: 'Ago' },
    { value: 4.5, label: 'Sep' },
    { value: 4.4, label: 'Oct' },
    { value: 4.6, label: 'Nov' },
    { value: 4.7, label: 'Dic' }
  ]
};

interface PropTechChartsProps {
  variant?: 'dashboard' | 'analytics';
}

export const PropTechCharts: React.FC<PropTechChartsProps> = ({ variant = 'dashboard' }) => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Analytics PropTech
          </Text>
          <Text className="text-gray-600">
            Métricas avanzadas del sector inmobiliario
          </Text>
        </View>

        {/* Gráfico 1: Tasa de Ocupación */}
        <ChartContainer
          title="Tasa de Ocupación"
          subtitle="Porcentaje de propiedades ocupadas por mes"
        >
          <View className="items-center">
            <LineChart
              data={mockChartData.occupancyRate}
              width={chartWidth - 40}
              height={200}
              color="#10b981"
              thickness={3}
              dataPointsColor="#059669"
              dataPointsRadius={6}
              curved
              animateOnDataChange
              animationDuration={1000}
            />
          </View>
          <View className="flex-row items-center justify-center mt-4">
            <FontAwesome name="arrow-up" size={12} color="#10b981" />
            <Text className="text-green-600 text-sm font-medium ml-1">
              +4% respecto al mes anterior (96% ocupación)
            </Text>
          </View>
        </ChartContainer>

        {/* Gráfico 2: Ingresos Mensuales */}
        <ChartContainer 
          title="Ingresos Mensuales" 
          subtitle="Evolución de ingresos (en miles de euros)"
        >
          <View className="items-center">
            <BarChart
              data={mockChartData.monthlyRevenue}
              width={chartWidth - 40}
              height={200}
              barWidth={35}
              spacing={25}
              roundedTop
              roundedBottom
              frontColor="#3b82f6"
            />
          </View>
          <View className="flex-row items-center justify-center mt-4">
            <FontAwesome name="euro" size={12} color="#3b82f6" />
            <Text className="text-blue-600 text-sm font-medium ml-1">
              €58K este mes (+5.4%)
            </Text>
          </View>
        </ChartContainer>

        {/* Gráfico 3: Distribución por Tipo de Propiedad */}
        <ChartContainer 
          title="Distribución de Propiedades" 
          subtitle="Por tipo de inmueble"
        >
          <View className="items-center">
            <PieChart
              data={mockChartData.propertyTypes}
              donut
              radius={80}
              innerRadius={30}
              centerLabelComponent={() => (
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-800">100%</Text>
                  <Text className="text-xs text-gray-600">Total</Text>
                </View>
              )}
            />
          </View>
          <View className="flex-row flex-wrap justify-around mt-6">
            {mockChartData.propertyTypes.map((item, index) => (
              <View key={index} className="flex-row items-center mb-2 w-[45%]">
                <View 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-sm text-gray-700 flex-1">
                  {item.label}: {item.value}%
                </Text>
              </View>
            ))}
          </View>
        </ChartContainer>

        {/* Gráfico 4: Tiempo Promedio de Alquiler */}
        <ChartContainer 
          title="Tiempo Promedio de Alquiler" 
          subtitle="Días para alquilar por zona"
        >
          <View className="items-center">
            <BarChart
              data={mockChartData.averageRentalTime}
              width={chartWidth - 40}
              height={200}
              barWidth={30}
              spacing={20}
              roundedTop
              frontColor="#8b5cf6"
            />
          </View>
          <View className="flex-row items-center justify-center mt-4">
            <FontAwesome name="clock-o" size={12} color="#8b5cf6" />
            <Text className="text-purple-600 text-sm font-medium ml-1">
              Promedio general: 20.6 días
            </Text>
          </View>
        </ChartContainer>

        {/* Gráfico 5: Satisfacción de Inquilinos */}
        <ChartContainer 
          title="Satisfacción de Inquilinos" 
          subtitle="Rating promedio (escala 1-5)"
        >
          <View className="items-center">
            <LineChart
              data={mockChartData.tenantSatisfaction}
              width={chartWidth - 40}
              height={200}
              color="#f59e0b"
              thickness={4}
              dataPointsColor="#d97706"
              dataPointsRadius={6}
              curved
              animateOnDataChange
              animationDuration={1000}
              startOpacity={0.8}
              endOpacity={0.3}
              startFillColor="#fbbf24"
              endFillColor="#fef3c7"
              areaChart
            />
          </View>
          <View className="flex-row items-center justify-center mt-4">
            <FontAwesome name="star" size={12} color="#f59e0b" />
            <Text className="text-yellow-600 text-sm font-medium ml-1">
              4.7/5 este mes (+0.1 puntos)
            </Text>
          </View>
        </ChartContainer>

        {/* Insights y Recomendaciones */}
        <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            💡 Insights Clave
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-start">
              <View className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                <FontAwesome name="arrow-up" size={14} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Ocupación en máximo histórico</Text>
                <Text className="text-gray-600 text-sm">96% de ocupación, el mejor mes del año</Text>
              </View>
            </View>
            
            <View className="flex-row items-start">
              <View className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                <FontAwesome name="euro" size={14} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Crecimiento sostenido de ingresos</Text>
                <Text className="text-gray-600 text-sm">Incremento del 28% respecto al año pasado</Text>
              </View>
            </View>
            
            <View className="flex-row items-start">
              <View className="bg-yellow-100 p-2 rounded-full mr-3 mt-1">
                <FontAwesome name="clock-o" size={14} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Oportunidad en zona Este</Text>
                <Text className="text-gray-600 text-sm">28 días promedio de alquiler, revisar pricing</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};