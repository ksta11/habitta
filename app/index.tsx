import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Label from '../components/atoms/Label';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuario autenticado, redirigir según el rol
        const redirectPath = user.role === 'admin' ? '/(admin)/home' : '/(user)/home';
        console.log('🔄 Usuario autenticado, redirigiendo a:', redirectPath);
        router.replace(redirectPath);
      } else {
        // Usuario no autenticado, ir al login
        console.log('🔄 Usuario no autenticado, redirigiendo a login');
        router.replace('/auth/login');
      }
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <Label 
        text="Habitta" 
        size="xl" 
        weight="bold"
      />
      <View className="mt-2">
        <Label 
          text="Cargando..." 
          size="md"
        />
      </View>
    </View>
  );
}


