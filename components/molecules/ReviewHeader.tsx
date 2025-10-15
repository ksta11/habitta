import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ReviewHeaderProps {
  title: string;
  onBack: () => void;
}

export default function ReviewHeader({ title, onBack }: ReviewHeaderProps) {
  return (
    <View className="flex-row items-center gap-4 px-6 py-4 border-b border-gray-200">
      <Pressable 
        onPress={onBack}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <FontAwesome name="arrow-left" size={20} color="#374151" />
      </Pressable>
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
    </View>
  );
}