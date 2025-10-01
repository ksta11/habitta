import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Label from '../components/atoms/Label';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuario autenticado, redirigir según el rol
        let redirectPath: Parameters<typeof router.replace>[0];
        switch (user.role) {
          case 'admin':
            redirectPath = '/(admin)/home';
            break;
          case 'owner':
            redirectPath = '/(owner)/(properties)';
            break;
          case 'user':
          default:
            redirectPath = '/(user)/home';
            break;
        }
        console.log('🔄 Usuario autenticado, redirigiendo a:', redirectPath);
        router.replace(redirectPath);
      } else {
        // Usuario no autenticado, ir al login
        console.log('🔄 Usuario no autenticado, redirigiendo a login');
        router.replace('/auth/login');
      }
    }
  }, [isLoading, isAuthenticated, user]);

  // Mostrar estado de carga mientras se determina la autenticación
  if (isLoading) {
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

  // Si no está loading pero aún no se ha redirigido, mostrar loading también
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <Label 
        text="Habitta" 
        size="xl" 
        weight="bold"
      />
      <View className="mt-2">
        <Label 
          text="Redirigiendo..." 
          size="md"
        />
      </View>
    </View>
  );
}


