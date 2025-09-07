import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PropertyCardProps {
  price: string;
  address: string;
  area: string;
  bathrooms: string;
  rooms: string;
  imageUrl: string;
  onPress?: () => void;
}

export default function PropertyCard({
  price,
  address,
  area,
  bathrooms,
  rooms,
  imageUrl,
  onPress
}: PropertyCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="block rounded-lg p-4 shadow-sm bg-white"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        className="h-56 w-full rounded-md"
        resizeMode="cover"
      />

      <View className="mt-2">
        <View>
          <Text className="text-sm text-gray-500">{price}</Text>
        </View>

        <View>
          <Text className="font-medium text-gray-900">{address}</Text>
        </View>

        <View className="mt-6 flex-row items-center gap-8">
          <View className="flex-row shrink-0 items-center gap-2">
            <Ionicons 
              name="resize-outline" 
              size={16} 
              color="#4338ca" 
            />

            <View>
              <Text className="text-xs text-gray-500">Area</Text>
              <Text className="text-xs font-medium text-gray-900">{area}</Text>
            </View>
          </View>

          <View className="flex-row shrink-0 items-center gap-2">
            <Ionicons 
              name="water-outline" 
              size={16} 
              color="#4338ca" 
            />

            <View>
              <Text className="text-xs text-gray-500">Bathroom</Text>
              <Text className="text-xs font-medium text-gray-900">{bathrooms}</Text>
            </View>
          </View>

          <View className="flex-row shrink-0 items-center gap-2">
            <Ionicons 
              name="bed-outline" 
              size={16} 
              color="#4338ca" 
            />

            <View>
              <Text className="text-xs text-gray-500">Rooms</Text>
              <Text className="text-xs font-medium text-gray-900">{rooms}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}