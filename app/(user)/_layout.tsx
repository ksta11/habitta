import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AuthGuard } from '../../middleware/AuthGuard';

export default function UserTabsLayout() {
  return (
    <AuthGuard requiredRole="user">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#320964", // blue-600
          tabBarInactiveTintColor: "#BD93EF", // gray-500
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
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
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
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(home)"
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
