import React from 'react';
import { View } from 'react-native';
import Label from '../components/atoms/Label';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Componente de pantalla de carga genérico para la aplicación
 * Muestra el logo de Habitta y un mensaje opcional
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <Label 
        text="Habitta" 
        size="xl" 
        weight="bold"
      />
      <View className="mt-2">
        <Label 
          text={message} 
          size="md"
        />
      </View>
    </View>
  );
};
