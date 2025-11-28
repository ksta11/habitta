import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Property } from '../../interfaces/property/PropertyInterface';
import { hapticFeedback } from '../../utils/haptics';
import Label from '../atoms/Label';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  
  // Maneja el press con haptic feedback
  const handlePress = () => {
    hapticFeedback.buttonPress();
    onPress();
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentImageIndex(roundIndex);
  };
  
  return (
    <View className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-4">
      <View className="relative">
        {property.images && property.images.length > 1 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: screenWidth, height: 192 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={screenWidth}
              decelerationRate="fast"
              snapToAlignment="start"
            >
              {property.images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.url_image }}
                  style={{ width: screenWidth, height: 192 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
              {property.images.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
            <Pressable
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2"
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#6b7280"} />
            </Pressable>
          </>
        ) : (
          <>
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
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#6b7280"} />
            </Pressable>
          </>
        )}
      </View>
      <Pressable onPress={handlePress}>
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
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Label
              text={`${property.address}, ${property.city}`}
              size="sm"
              variant="default"
            />
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="flex-row shrink-0 items-center gap-1">
                <Ionicons 
                  name="resize-outline" 
                  size={14} 
                  color="#4338ca" 
                />
                <View>
                  <Text className="text-xs text-gray-500">Area</Text>
                  <Text className="text-xs font-medium text-gray-900">{property.area} m²</Text>
                </View>
              </View>

              <View className="flex-row shrink-0 items-center gap-1">
                <Ionicons 
                  name="bed-outline" 
                  size={14} 
                  color="#4338ca" 
                />
                <View>
                  <Text className="text-xs text-gray-500">Hab</Text>
                  <Text className="text-xs font-medium text-gray-900">{property.rooms}</Text>
                </View>
              </View>

              <View className="flex-row shrink-0 items-center gap-1">
                <Ionicons 
                  name="water-outline" 
                  size={14} 
                  color="#4338ca" 
                />
                <View>
                  <Text className="text-xs text-gray-500">Baños</Text>
                  <Text className="text-xs font-medium text-gray-900">{property.bathrooms}</Text>
                </View>
              </View>
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
    </View>
  );
}