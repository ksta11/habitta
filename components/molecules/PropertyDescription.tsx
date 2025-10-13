import React from 'react';
import { View, Text } from 'react-native';

interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({
  description
}: PropertyDescriptionProps) {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-lg font-semibold text-gray-900">Descripción</Text>
      </View>
      <Text className="text-sm text-gray-600">{description}</Text>
    </View>
  );
}