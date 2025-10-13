import React from 'react';
import { View, Text } from 'react-native';

interface Amenity {
  icon: () => string;
  name: string;
}

interface PropertyAmenitiesProps {
  services: string;
  amenities: Amenity[];
}

export default function PropertyAmenities({
  services,
  amenities
}: PropertyAmenitiesProps) {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="text-lg font-semibold text-gray-900">Servicios</Text>
      </View>
      <View className="bg-gray-50 rounded-lg p-4 mb-3">
        <Text className="text-sm text-gray-700">{services}</Text>
      </View>
      <View className="flex-row flex-wrap">
        {amenities.map((amenity, index) => (
          <View key={index} className="flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3 w-[48%] mr-2">
            <Text>{amenity.icon()}</Text>
            <Text className="text-sm font-medium text-gray-900">{amenity.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}