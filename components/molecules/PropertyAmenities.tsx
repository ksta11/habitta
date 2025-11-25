import React from 'react';
import { Text, View } from 'react-native';

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
      <View className="flex-row flex-wrap justify-between">
        {amenities.map((amenity, index) => (
          <View key={index} className="flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3" style={{ width: '48%' }}>
            <Text>{amenity.icon()}</Text>
            <Text className="text-sm font-medium text-gray-900">{amenity.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}