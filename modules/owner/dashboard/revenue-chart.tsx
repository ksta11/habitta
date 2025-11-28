import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';

interface MonthlyIncome {
  month: string;
  amount: number;
}

interface RevenueChartProps {
  monthlyIncome: MonthlyIncome[];
  selectedPeriod: '3months' | '6months' | '1year' | 'all';
  onPeriodChange: (period: '3months' | '6months' | '1year' | 'all') => void;
  loading?: boolean;
}

const PERIOD_OPTIONS = [
  { label: 'Últimos 3 meses', value: '3months' as const },
  { label: 'Últimos 6 meses', value: '6months' as const },
  { label: 'Último año', value: '1year' as const },
  { label: 'Todo el tiempo', value: 'all' as const },
];

export function RevenueChart({ monthlyIncome, selectedPeriod, onPeriodChange, loading = false }: RevenueChartProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const selectedPeriodLabel = PERIOD_OPTIONS.find(option => option.value === selectedPeriod)?.label || 'Seleccionar período';

  const handlePeriodSelect = (period: '3months' | '6months' | '1year' | 'all') => {
    onPeriodChange(period);
    setDropdownVisible(false);
  };
  // Formatear el ingreso como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="h-48 justify-center items-center">
            <Text className="text-gray-500 text-center">
              Cargando datos...
            </Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos, mostrar un mensaje
  if (monthlyIncome.length === 0) {
    return (
      <View className="relative">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Ingresos</CardTitle>
            <View className="mt-2">
              <Pressable
                onPress={() => setDropdownVisible(!dropdownVisible)}
                className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
              >
                <Text className="text-gray-700">{selectedPeriodLabel}</Text>
              </Pressable>
            </View>
          </CardHeader>
          <CardContent>
            <View className="h-48 justify-center items-center">
              <Text className="text-gray-500 text-center">
                No hay datos de ingresos disponibles
              </Text>
            </View>
          </CardContent>
        </Card>
        {dropdownVisible && (
          <View className="absolute top-20 left-4 bg-white rounded-lg border border-gray-200 shadow-lg w-48 elevation-10" style={{ zIndex: 1000 }}>
            {PERIOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handlePeriodSelect(option.value)}
                className="py-3 px-4 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-base text-center">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  const maxRevenue = Math.max(...monthlyIncome.map(d => d.amount));
  
  // Calcular el total del período seleccionado
  const totalPeriod = monthlyIncome.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <View className="relative">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <View className="flex-row justify-between items-center">
            <CardTitle className="text-lg font-semibold">Ingresos</CardTitle>
            <Pressable
              onPress={() => setDropdownVisible(!dropdownVisible)}
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-700">{selectedPeriodLabel}</Text>
            </Pressable>
          </View>
        </CardHeader>
      <CardContent>
        <View className="h-48 flex-row items-end justify-between px-2">
          {monthlyIncome.map((item, index) => {
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
          <Text className="text-sm text-gray-600">Total {selectedPeriodLabel.toLowerCase()}</Text>
          <Text className="font-semibold text-violet text-lg">
            {formatCurrency(totalPeriod)}
          </Text>
        </View>
      </CardContent>
    </Card>
    {dropdownVisible && (
      <View className="absolute top-16 right-4 bg-white rounded-lg border border-gray-200 shadow-lg w-48 elevation-10" style={{ zIndex: 1000 }}>
        {PERIOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handlePeriodSelect(option.value)}
            className="py-3 px-4 border-b border-gray-100 last:border-b-0"
          >
            <Text className="text-base text-center">{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);
}
