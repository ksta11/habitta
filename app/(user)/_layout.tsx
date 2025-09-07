import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function UserTabsLayout() {
  return (
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
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      
      {/* Tab Citas */}
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Citas",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
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
    </Tabs>
  );
}
