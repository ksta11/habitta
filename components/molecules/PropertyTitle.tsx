import React from 'react';
import { View, Text, Pressable } from 'react-native';

// Icono simulado con emoji
const LocationIcon = () => <Text>📍</Text>;

interface PropertyTitleProps {
  title: string;
  type: string;
  address: string;
  city: string;
  rooms: number;
  bathrooms: number;
  area: number;
  loading?: boolean;
  notFound?: boolean;
  onGoBack?: () => void;
}

export default function PropertyTitle({
  title,
  type,
  address,
  city,
  rooms,
  bathrooms,
  area,
  loading = false,
  notFound = false,
  onGoBack
}: PropertyTitleProps) {
  if (loading) {
    return (
      <View className="mb-4">
        <Text className="text-gray-600 mt-4">{title}</Text>
      </View>
    );
  }

  if (notFound) {
    return (
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
        <Text className="text-sm text-gray-600 mb-4">{address}</Text>
        {onGoBack && (
          <Pressable 
            className="mt-4 bg-violet px-6 py-3 rounded-full"
            onPress={onGoBack}
          >
            <Text className="text-white font-semibold">Volver</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View className="mb-4">
      <View className="mb-2">
        <Text className="text-xl font-bold text-gray-900">{title}</Text>
      </View>
      <View className="flex-row items-center gap-2 mb-2">
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-semibold text-gray-900 capitalize">
            {type}
          </Text>
          <Text className="text-sm text-gray-400">•</Text>
          <Text className="text-sm text-gray-600">
            {rooms} hab • {bathrooms} baños • {area} m²
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1">
        <LocationIcon />
        <Text className="text-sm text-gray-600">{address}, {city}</Text>
      </View>
    </View>
  );
}