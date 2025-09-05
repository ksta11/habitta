import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PropertyLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="property"
                options={{
                title: 'Propiedades'
                }}
            />
            {/* Aquí se renderizan las pantallas hijas */}
        </Stack>
    </SafeAreaView>
  );
}