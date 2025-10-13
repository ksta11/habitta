import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface EmptyReviewsProps {
  title: string;
  description: string;
  icon?: keyof typeof FontAwesome.glyphMap;
}

export default function EmptyReviews({ 
  title, 
  description, 
  icon = "star-o" 
}: EmptyReviewsProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <FontAwesome name={icon} size={64} color="#D1D5DB" />
      <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 mt-2 text-center px-4">
        {description}
      </Text>
    </View>
  );
}