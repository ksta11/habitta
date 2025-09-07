import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PropertyLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2563eb", // blue-600
          tabBarInactiveTintColor: "#6b7280", // gray-500
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb", // gray-200
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        {/* Tab Home */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        
        {/* Tab Perfil */}
        <Tabs.Screen
          name="property"
          options={{
            title: 'Propiedades',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="building" size={size} color={color} />
              ),
          }}
        />

        {/* Tab Configuración */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ajustes",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />

        {/* Ocultar las subcarpetas de las tabs */}
        <Tabs.Screen
          name="(properties)"
          options={{
            href: null, // Esto oculta la carpeta de las tabs
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}