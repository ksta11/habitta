import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

interface PhoneCallButtonProps {
  phoneNumber: string;
  variant?: 'primary' | 'secondary' | 'small';
  showLabel?: boolean;
}

export default function PhoneCallButton({
  phoneNumber,
  variant = 'primary',
  showLabel = true,
}: PhoneCallButtonProps) {
  const handlePress = () => {
    // Limpiar el número de teléfono de espacios y caracteres especiales excepto +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Construir la URL de llamada
    const phoneUrl = `tel:${cleanPhone}`;
    
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          console.log('No se puede realizar la llamada');
        }
      })
      .catch((err) => console.error('Error al realizar la llamada:', err));
  };

  if (variant === 'small') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="bg-blue-500 p-2 rounded-xl items-center justify-center"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-1 bg-blue-500 rounded-2xl py-3 px-4 flex-row items-center justify-center"
      >
        <Ionicons name="call" size={20} color="#fff" />
        {showLabel && (
          <Text className="text-white font-semibold ml-2">Llamar</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-blue-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
      style={{
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name="call" size={24} color="#fff" />
      {showLabel && (
        <Text className="text-white font-bold text-base ml-2">Llamar</Text>
      )}
    </TouchableOpacity>
  );
}
