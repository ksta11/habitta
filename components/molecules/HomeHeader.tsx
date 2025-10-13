import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Label from '../atoms/Label';

// Iconos simulados con emojis
const UserIcon = () => <Text>👤</Text>;

interface HomeHeaderProps {
  onNavigateToReviews: () => void;
}

export default function HomeHeader({ onNavigateToReviews }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 bg-violet rounded-lg flex items-center justify-center">
          <Text className="text-white text-sm font-bold">H</Text>
        </View>
        <View>
          <Label text="Habitta" size="lg" weight="bold" />
          <Label
            text="Encuentra tu espacio ideal"
            size="sm"
            variant="default"
          />
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable 
          onPress={onNavigateToReviews}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm"
        >
          <FontAwesome name="inbox" size={16} color="gray-700" />
        </Pressable>
      </View>
    </View>
  );
}