import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TailwindTest() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <View className="bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🎉 Tailwind CSS
        </Text>
        <Text className="text-lg text-gray-600 mb-6 text-center">
          ¡Funciona correctamente!
        </Text>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-center">
            Botón con Tailwind
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
