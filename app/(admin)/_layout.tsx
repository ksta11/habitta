import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: logout
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header del drawer */}
        <View className="bg-black px-6 py-8 mb-4">
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-full mr-4">
              <FontAwesome name="shield" size={24} color="#1F1F1F" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg">Admin Panel</Text>
              <Text className="text-red-100 text-sm">Panel de Administración</Text>
            </View>
          </View>
        </View>

        {/* Items del drawer */}
        <DrawerItemList {...props} />
        
        {/* Separador */}
        <View className="border-t border-gray-200 mt-4 pt-4 mx-4">
          <DrawerItem
            label="Cerrar Sesión"
            onPress={handleLogout}
            icon={({ color, size }) => (
              <FontAwesome name="sign-out" size={size} color="#dc2626" />
            )}
            labelStyle={{ 
              color: '#dc2626', 
              fontWeight: '600' 
            }}
            style={{
              marginHorizontal: 0,
            }}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function AdminDrawerLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1F1F1F'
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#531A99',
        drawerInactiveTintColor: '#6b7280',
        drawerStyle: {
          backgroundColor: '#ffffff',
        },
        drawerLabelStyle: {
          fontWeight: '500',
        },
      }}
    >
      {/* Pantalla Home */}
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "Panel de Admin",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Pantalla Users */}
      <Drawer.Screen
        name="users"
        options={{
          title: " Usuarios",
          headerTitle: "Usuarios",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />

      {/* Pantalla Solicitudes */}
      <Drawer.Screen
        name="solicitudes"
        options={{
          title: " Solicitudes",
          headerTitle: "Solicitudes de Propietarios",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="file-text" size={size} color={color} />
          ),
        }}
      />

      {/* Pantalla Properties */}
      <Drawer.Screen
        name="properties"
        options={{
          title: " Propiedades",
          headerTitle: "Propiedades",
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="building" size={size} color={color} />
          ),
        }}
      />
      </Drawer>
  );
}
