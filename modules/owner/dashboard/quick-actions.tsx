import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { hapticFeedback } from '../../../utils/haptics';
import { pressedPrimaryButton, pressedSecondaryButton, standarDeepVioletButton, standarLavenderButton, standarPrimaryButton } from '../../../utils/TokensDesing';

const actions = [
  {
    title: "Publicar Inmueble",
    description: "Agregar nueva propiedad",
    icon: "add" as const,
    link: "/(owner)/(properties)/create/Form",
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
    title: "Ver Estadísticas",
    description: "Reportes completos",
    icon: "bar-chart" as const,
    link: "/(owner)/home",
    token: standarLavenderButton,
    pressedToken: pressedSecondaryButton,
  },
  {
    title: "Ajustar Plan",
    description: "Cambiar suscripción",
    icon: "settings" as const,
    link: "/(owner)/home",
    token: standarDeepVioletButton,
    pressedToken: pressedPrimaryButton,
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
