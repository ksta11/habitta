import React from 'react';
import { View, Text } from 'react-native';

interface PropertyInfoCardProps {
  publicationDate: string;
  status: string;
  area: number;
}

export default function PropertyInfoCard({
  publicationDate,
  status,
  area
}: PropertyInfoCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'rented':
        return 'Rentado';
      default:
        return 'No disponible';
    }
  };

  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-lg font-semibold text-gray-900">Información de la propiedad</Text>
      </View>
      <View className="bg-gray-50 rounded-lg p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-600">Fecha de publicación:</Text>
          <Text className="text-sm font-medium text-gray-900">
            {new Date(publicationDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-600">Estado:</Text>
          <Text className="text-sm font-medium text-gray-900 capitalize">
            {getStatusLabel(status)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">Área total:</Text>
          <Text className="text-sm font-medium text-gray-900">{area} m²</Text>
        </View>
      </View>
    </View>
  );
}