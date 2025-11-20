import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  variant?: 'primary' | 'secondary' | 'small';
  showLabel?: boolean;
}

export default function WhatsAppButton({
  phoneNumber,
  message = '',
  variant = 'primary',
  showLabel = true,
}: WhatsAppButtonProps) {
  const handlePress = () => {
    // Limpiar el número de teléfono de espacios y caracteres especiales
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construir la URL de WhatsApp
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}${message ? `&text=${encodedMessage}` : ''}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          console.log('WhatsApp no está instalado');
        }
      })
      .catch((err) => console.error('Error al abrir WhatsApp:', err));
  };

  if (variant === 'small') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="bg-green-500 p-2 rounded-xl items-center justify-center"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-1 bg-green-500 rounded-2xl py-3 px-4 flex-row items-center justify-center"
      >
        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
        {showLabel && (
          <Text className="text-white font-semibold ml-2">WhatsApp</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-green-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
      style={{
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Ionicons name="logo-whatsapp" size={24} color="#fff" />
      {showLabel && (
        <Text className="text-white font-bold text-base ml-2">WhatsApp</Text>
      )}
    </TouchableOpacity>
  );
}
