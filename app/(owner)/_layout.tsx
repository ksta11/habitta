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
        {/* Tab inicio */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />

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

        {/* Tab Solicitudes */}
        <Tabs.Screen
          name="(applications)"
          options={{
            title: 'Solicitudes',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="envelope" size={size} color={color} />
            ),
          }}
        />

        {/* Tab Configuración */}
        <Tabs.Screen
          name="(settings)"
          options={{
            title: "Ajustes",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />

        {/* Ocultar ruta de reviews del tab bar */}
        <Tabs.Screen
          name="(review)"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}