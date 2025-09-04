import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

export default function ProfileScreen() {
  
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            // Aquí puedes limpiar el token almacenado
            console.log('🚪 Cerrando sesión...');
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-blue-600">S</Text>
          </View>
          <Label 
            text="Sebastian" 
            size="xl" 
            weight="bold"
          />
          <Label 
            text="sebs@gmail.com" 
            size="md" 
            variant="default"
          />
          <View className="mt-2 px-3 py-1 bg-green-100 rounded-full">
            <Label 
              text="Usuario" 
              size="sm" 
              weight="medium"
            />
          </View>
        </View>
      </View>

      {/* Información personal */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Información Personal" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Label text="Teléfono" size="md" />
            <Label text="3385472555" size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Label text="Fecha de registro" size="md" />
            <Label text="04 Sep 2025" size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2">
            <Label text="ID de usuario" size="md" />
            <Label text="fadb7f4a..." size="md" weight="medium" />
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Label 
          text="Acciones" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Label text="Editar Perfil" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Label text="Cambiar Contraseña" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3" onPress={handleLogout}>
            <Label text="Cerrar Sesión" size="md" variant="error" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
