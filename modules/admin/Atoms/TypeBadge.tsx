import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface TypeBadgeProps {
  type: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartamento':
        return 'building';
      case 'casa':
        return 'home';
      case 'estudio':
        return 'bed';
      case 'ático':
        return 'star';
      case 'loft':
        return 'industry';
      default:
        return 'building';
    }
  };

  return (
    <View className="flex-row items-center bg-purple-100 px-2 py-1 rounded-full">
      <FontAwesome name={getTypeIcon(type)} size={10} color="#7c3aed" />
      <Text className="text-purple-800 text-xs font-medium ml-1">{type}</Text>
    </View>
  );
};

