import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../middleware/AuthGuard';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  
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
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Datos del usuario con fallbacks
  const displayName = user?.name || 'Usuario';
  const displayEmail = user?.email || 'email@ejemplo.com';
  const displayPhone = user?.phone || 'No especificado';
  const displayRole = user?.role || 'user';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <AuthGuard requiredRole="user">
      <View className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-blue-600">{userInitial}</Text>
          </View>
          <Label 
            text={displayName} 
            size="xl" 
            weight="bold"
          />
          <Label 
            text={displayEmail} 
            size="md" 
            variant="default"
          />
          <View className="mt-2 px-3 py-1 bg-green-100 rounded-full">
            <Label 
              text={displayRole === 'admin' ? 'Administrador' : 'Usuario'} 
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
            <Label text={displayPhone} size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Label text="Fecha de registro" size="md" />
            <Label text={user?.creation_date ? new Date(user.creation_date).toLocaleDateString() : 'No disponible'} size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2">
            <Label text="ID de usuario" size="md" />
            <Label text={user?.id?.substring(0, 8) + '...' || 'No disponible'} size="md" weight="medium" />
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
    </AuthGuard>
  );
}
