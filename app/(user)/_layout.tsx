import React from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { AuthGuard } from '../../middleware/AuthGuard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticFeedback } from '../../utils/haptics';

export default function UserTabsLayout() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_BASE_HEIGHT = 70; // base height used previously

  return (
    <AuthGuard requiredRole="user">
            <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#320964", // deep-violet
              tabBarInactiveTintColor: "#BD93EF", // lavender-bright
              tabBarStyle: {
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb", // gray-200
                // respect bottom safe area so buttons overlay looks integrated
                height: TAB_BAR_BASE_HEIGHT + insets.bottom,
                paddingBottom: insets.bottom + 10,
                paddingTop: 10,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "500",
              },
            }}
            screenListeners={{
              tabPress: () => {
                // Feedback háptico al cambiar de tab
                hapticFeedback.tabChange();
              },
            }}
          >
        {/* Tab Home */}
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        
        {/* Tab Perfil */}
        <Tabs.Screen
          name="profile"
         options={{
            href: null, 
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

         {/* Tab arrendamientos */}
        <Tabs.Screen
          name="(leases)"
          options={{
            title: 'leases',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="envelope" size={size} color={color} />
            ),
          }}
        />
        
        
        {/* Tab Configuración */}
        <Tabs.Screen
          name="(settings)"
          options={{
            href: null, 
          }}
        />

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
