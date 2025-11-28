import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../../../components/atoms/Card';

interface StatsGridProps {
  totalProperties: number;
  pendingApplications: number;
  scheduledMaintenances: number;
  lastMonthIncome: number;
  occupiedVsTotal: { occupied: number; total: number };
}

export function StatsGrid({ 
  totalProperties, 
  pendingApplications, 
  scheduledMaintenances, 
  lastMonthIncome,
  occupiedVsTotal
}: StatsGridProps) {
  
  // Formatear el ingreso como moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Propiedades Publicadas",
      value: totalProperties.toString(),
      icon: "home" as const,
      color: "#A346E6", // lavender-indigo
      bgColor: "#A346E6",
    },
    {
      title: "Solicitudes Pendientes",
      value: pendingApplications.toString(),
      icon: "mail" as const,
      color: "#531a99", // violet original
      bgColor: "#531a99",
    },
    {
      title: "Mantenimientos",
      value: scheduledMaintenances.toString(),
      icon: "construct" as const,
      color: "#320964", // deep-violet
      bgColor: "#320964",
    },
    {
      title: "Propiedades Ocupadas",
      value: `${occupiedVsTotal.occupied} / ${occupiedVsTotal.total}`,
      icon: "people" as const,
      color: "#7C3AED", // violet-light
      bgColor: "#7C3AED",
    },
    {
      title: "Pagos Este Mes",
      value: formatCurrency(lastMonthIncome),
      icon: "card" as const,
      color: "#BD93EF", // lavender-bright
      bgColor: "#BD93EF",
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-4">
      {stats.map((stat, index) => (
        <View key={index} className="flex-1 min-w-[45%]">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <View className="items-center space-y-3">
                <View 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${stat.bgColor}20` }}
                >
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <View className="items-center">
                  <Text className="text-sm text-gray-600 font-medium text-center">{stat.title}</Text>
                  <Text className="text-2xl font-bold mt-1 text-erie-black">{stat.value}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      ))}
    </View>
  );
}
