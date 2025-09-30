import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';

interface MonthlyIncome {
  month: string;
  amount: number;
}

interface RevenueChartProps {
  monthlyIncome: MonthlyIncome[];
}

export function RevenueChart({ monthlyIncome }: RevenueChartProps) {
  // Formatear el ingreso como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Obtener los últimos 6 meses si hay más datos, o todos si hay menos
  const recentData = monthlyIncome.slice(-6);
  
  // Si no hay datos, mostrar un mensaje
  if (recentData.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Ingresos Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="h-48 justify-center items-center">
            <Text className="text-gray-500 text-center">
              No hay datos de ingresos disponibles
            </Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...recentData.map(d => d.amount));
  
  // Calcular el total de los últimos 6 meses
  const totalLast6Months = recentData.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Ingresos Últimos 6 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="h-48 flex-row items-end justify-between px-2">
          {recentData.map((item, index) => {
            const height = maxRevenue > 0 ? (item.amount / maxRevenue) * 160 : 8; // 160 is the max height in points
            return (
              <View key={index} className="flex-1 items-center">
                <View 
                  className="bg-violet rounded-t-md w-8 mb-2"
                  style={{ height: Math.max(height, 8) }} // Minimum height of 8
                />
                <Text className="text-xs text-gray-600 font-medium" numberOfLines={1}>
                  {item.month.length > 3 ? item.month.substring(0, 3) : item.month}
                </Text>
              </View>
            );
          })}
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">Total últimos 6 meses</Text>
          <Text className="font-semibold text-violet text-lg">
            {formatCurrency(totalLast6Months)}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
