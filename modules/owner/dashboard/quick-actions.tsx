import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { hapticFeedback } from '../../../utils/haptics';
import { pressedPrimaryButton, pressedSecondaryButton, standarLavenderButton, standarPrimaryButton } from '../../../utils/TokensDesing';

const actions = [
  {
    title: "Ver Inmuebles",
    description: "Agregar o edita propiedades",
    icon: "add" as const,
    link: "/(owner)/(properties)",
    token: standarPrimaryButton,
    pressedToken: pressedPrimaryButton,
  },
  {
    title: "Ver Reviews",
    description: "Gestionar reseñas",
    icon: "chatbubbles" as const,
    link: "/(owner)/(review)",
    token: standarPrimaryButton,
    pressedToken: pressedPrimaryButton,
  },
  {
    title: "Ver Solicitudes",
    description: "Miras las solicitudes de tus propiedades",
    icon: "mail" as const,
    link: "/(owner)/(applications)",
    token: standarLavenderButton,
    pressedToken: pressedSecondaryButton,
  },
];

export function QuickActions() {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Accesos Rápidos</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.map((action, index) => (
          <Pressable 
            key={index} 
            className={`w-full justify-start h-auto p-4 mb-1 rounded-xl ${pressedIndex === index ? action.pressedToken : action.token}`}
            onPressIn={() => setPressedIndex(index)}
            onPressOut={() => setPressedIndex(null)}
            onPress={() => {
              hapticFeedback.buttonPress();
              console.log('🚀 [QuickActions] Navegando a:', action.link);
              router.push(action.link as any);
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name={action.icon} size={20} color="white" style={{ marginRight: 12 }} />
              <View className="text-left">
                <Text className="font-medium text-white">{action.title}</Text>
                <Text className="text-xs text-white opacity-80">{action.description}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </CardContent>
    </Card>
  );
}
