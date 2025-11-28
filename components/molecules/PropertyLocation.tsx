import React from 'react';
import { View, Text } from 'react-native';

// Icono simulado con emoji
const LocationIcon = () => <Text>📍</Text>;

interface PropertyLocationProps {
  address: string;
  city: string;
}

export default function PropertyLocation({
  address,
  city
}: PropertyLocationProps) {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-lg font-semibold text-gray-900">Ubicación</Text>
      </View>
      <View className="bg-gray-50 rounded-lg p-4">
        <View className="flex-row items-center gap-2 mb-2">
          <LocationIcon />
          <Text className="text-sm font-medium text-gray-900">{address}, {city}</Text>
        </View>
        <Text className="text-sm text-gray-600">
          Excelente ubicación con acceso a restaurantes, cafeterías, centros comerciales y transporte público.
        </Text>
      </View>
    </View>
  );
}