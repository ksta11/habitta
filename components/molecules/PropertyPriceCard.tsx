import React from 'react';
import { View, Text } from 'react-native';

interface PropertyPriceCardProps {
  price: string;
  status: string;
}

export default function PropertyPriceCard({
  price,
  status
}: PropertyPriceCardProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'published':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Disponible ahora'
        };
      case 'rented':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'Rentado'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: 'No disponible'
        };
    }
  };

  const statusStyles = getStatusStyles(status);

  return (
    <View className="bg-gray-50 rounded-lg p-4 mb-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-gray-900">{price}</Text>
          <Text className="text-sm text-gray-600">/mes</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${statusStyles.bg}`}>
          <Text className={`text-sm font-medium ${statusStyles.text}`}>
            {statusStyles.label}
          </Text>
        </View>
      </View>
    </View>
  );
}