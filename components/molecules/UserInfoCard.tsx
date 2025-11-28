import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '../atoms/Card';
import { UserDAO } from '../../interfaces/UserInterface';

interface UserInfoCardProps {
  receiverUser: UserDAO | null;
}

export default function UserInfoCard({ receiverUser }: UserInfoCardProps) {
  // Obtener información del usuario receptor
  const getUserDisplayInfo = () => {
    if (receiverUser && receiverUser.user) {
      const user = receiverUser.user;
      // Generar iniciales del nombre
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
      };

      return {
        name: user.name || "Usuario Desconocido",
        initials: user.name ? getInitials(user.name) : "U", 
        role: user.role === 'owner' ? 'Propietario' : user.role === 'user' ? 'Inquilino' : 'Usuario',
      };
    }
    
    // Fallback mientras se cargan los datos
    return {
      name: "Cargando...",
      initials: "...", 
      role: "Usuario",
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <Card className="mb-6 bg-blue-50 border-0">
      <CardContent className="p-4">
        <View className="flex-row items-center gap-3">
          <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-xl">{userInfo.initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{userInfo.name}</Text>
            <Text className="text-sm text-gray-600">{userInfo.role}</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}