import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { router } from 'expo-router';
import { hapticFeedback } from '../../../utils/haptics';

const actions = [
  {
    title: "Publicar Inmueble",
    description: "Agregar nueva propiedad",
    icon: "add" as const,
    link: "/(owner)/(properties)/create/Form",
    color: "bg-violet", // violet principal
  },
  {
    title: "Ver Reviews",
    description: "Gestionar reseñas",
    icon: "chatbubbles" as const,
    link: "/(owner)/(review)",
    color: "bg-violet", // violet para mantener consistencia
  },
  {
    title: "Ver Estadísticas",
    description: "Reportes completos",
    icon: "bar-chart" as const,
    link: "/(owner)/home",
    color: "bg-lavender-indigo", // lavender-indigo
  },
  {
    title: "Ajustar Plan",
    description: "Cambiar suscripción",
    icon: "settings" as const,
    link: "/(owner)/home",
    color: "bg-deep-violet", // deep-violet
  },
];

export function QuickActions() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Accesos Rápidos</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.map((action, index) => (
          <Pressable 
            key={index} 
            className={`w-full justify-start h-auto p-4 mb-1 ${action.color} rounded-xl border-0`}
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
