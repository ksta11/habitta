import React from 'react';

import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthGuard } from '../../middleware/AuthGuard';

export default function PropertyLayout() {
  return (
    <AuthGuard requiredRole="owner">
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
          
          {/* Tab Propiedades */}
          <Tabs.Screen
            name="(properties)"
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

          {/* Ocultar el archivo property.tsx ya que usaremos (properties) */}
          <Tabs.Screen
            name="property"
            options={{
              href: null, // Esto oculta el archivo property.tsx
            }}
          />
        </Tabs>
      </SafeAreaView>
    </AuthGuard>
  );
}