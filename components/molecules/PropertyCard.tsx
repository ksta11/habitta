import React from 'react';
import { View, Pressable, Image, Text } from 'react-native';
import Label from '../atoms/Label';
import { Property } from '../../interfaces/property/PropertyInterface';
import { hapticFeedback } from '../../utils/haptics';

// Iconos simulados con emojis
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Text>{filled ? "❤️" : "🤍"}</Text>
);
const LocationIcon = () => <Text>📍</Text>;

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  formatPrice: (price: number) => string;
  getPropertyImage: (property: Property) => string;
}

export default function PropertyCard({
  property,
  isFavorite,
  onPress,
  onToggleFavorite,
  formatPrice,
  getPropertyImage
}: PropertyCardProps) {
  
  // Maneja el press con haptic feedback
  const handlePress = () => {
    hapticFeedback.buttonPress();
    onPress();
  };
  
  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-4"
    >
      <View className="relative">
        <Image
          source={{ uri: getPropertyImage(property) }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <Pressable
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2"
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <HeartIcon filled={isFavorite} />
        </Pressable>
      </View>
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Label
              text={property.title}
              size="md"
              weight="semibold"
            />
          </View>
        </View>
        <View className="flex-row items-center gap-1 mb-2">
          <LocationIcon />
          <Label
            text={`${property.address}, ${property.city}`}
            size="sm"
            variant="default"
          />
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-gray-600 capitalize">
              {property.type}
            </Text>
            <Text className="text-sm text-gray-400">•</Text>
            <Text className="text-sm text-gray-600">
              {property.rooms} hab • {property.bathrooms} baños
            </Text>
          </View>
          <View className="items-end">
            <Label
              text={formatPrice(property.price)}
              size="lg"
              weight="bold"
            />
            <Label text="/mes" size="sm" variant="default" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}