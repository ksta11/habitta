import React from 'react';
import { View, Pressable, Text } from 'react-native';

// Iconos simulados con emojis
const ArrowLeftIcon = () => <Text>←</Text>;
const HeartIcon = ({ filled }: { filled: boolean }) => <Text>{filled ? '❤️' : '🤍'}</Text>;

interface PropertyHeaderProps {
  onGoBack: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export default function PropertyHeader({
  onGoBack,
  onToggleFavorite,
  isFavorite
}: PropertyHeaderProps) {
  return (
    <View className="absolute top-12 left-0 right-0 z-10 flex-row items-center justify-between px-6 py-4">
      <Pressable
        className="bg-white/80 backdrop-blur-sm rounded-full p-3"
        onPress={onGoBack}
      >
        <ArrowLeftIcon />
      </Pressable>
      <View className="flex-row gap-2">
        <Pressable 
          className="bg-white/80 backdrop-blur-sm rounded-full p-3"
          onPress={onToggleFavorite}
        >
          <HeartIcon filled={isFavorite} />
        </Pressable>
      </View>
    </View>
  );
}