import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';

const data = [
  { month: "Ene", revenue: 18500 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 19800 },
  { month: "Abr", revenue: 25200 },
  { month: "May", revenue: 23800 },
  { month: "Jun", revenue: 24500 },
];

export function RevenueChart() {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Ingresos Últimos 6 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="h-48 flex-row items-end justify-between px-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 160; // 160 is the max height in points
            return (
              <View key={index} className="flex-1 items-center">
                <View 
                  className="bg-violet rounded-t-md w-8 mb-2"
                  style={{ height: Math.max(height, 8) }} // Minimum height of 8
                />
                <Text className="text-xs text-gray-600 font-medium">{item.month}</Text>
              </View>
            );
          })}
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">Total este mes</Text>
          <Text className="font-semibold text-violet text-lg">$24,500</Text>
        </View>
      </CardContent>
    </Card>
  );
}
