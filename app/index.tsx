import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Label from '../components/atoms/Label';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuthStatus = async () => {
      // Aquí puedes verificar si hay un token guardado
      // Por ahora redirigimos directamente al login
      setTimeout(() => {
        router.replace('/(owner)/property');
      }, 1000);
    };

    checkAuthStatus();
  }, []);

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


