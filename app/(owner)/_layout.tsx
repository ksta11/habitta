import React from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { AuthGuard } from '../../middleware/AuthGuard';

export default function OwnerTabsLayout() {
  return (
    <AuthGuard requiredRole="owner">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#320964", // deep-violet
          tabBarInactiveTintColor: "#BD93EF", // lavender-bright
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
    </AuthGuard>
  );
}