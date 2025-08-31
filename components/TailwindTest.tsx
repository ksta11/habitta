import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TailwindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-50">
      <View className="rounded-lg bg-white p-6 shadow-lg">
        <Text className="mb-4 text-center text-2xl font-bold text-gray-800">
          🎉 Tailwind CSS
        </Text>
        <Text className="mb-6 text-center text-lg text-gray-600">
          ¡Funciona correctamente!
        </Text>
        <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3">
          <Text className="text-center font-semibold text-white">
            Botón con Tailwind
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
