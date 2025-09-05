import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const properties = [
  {
    id: 1,
    title: 'Casa en la playa',
    status: 'Disponible',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: 'Departamento en la ciudad',
    status: 'Ocupado',
    image: 'https://via.placeholder.com/150',
  },
  // ...más propiedades
];

export default function PropertyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Propiedades</Text>
      <ScrollView>
        {properties.map((property) => (
          <View key={property.id} className="mb-4 p-4 bg-gray-100 rounded-lg flex-row items-center">
            <Image
              source={{ uri: property.image }}
              className="w-16 h-16 rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold">{property.title}</Text>
              <Text className="text-sm text-gray-500">{property.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="mt-4 bg-blue-500 rounded-lg p-4"
        onPress={() => router.push('/(owner)/properties/create/step1')}
      >
        <Text className="text-white text-center font-bold">Crear nueva propiedad</Text>
      </TouchableOpacity>
    </View>
  );
}