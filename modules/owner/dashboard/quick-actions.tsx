import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';

const actions = [
  {
    title: "Publicar Inmueble",
    description: "Agregar nueva propiedad",
    icon: "add" as const,
    color: "bg-violet", // violet principal
  },
  {
    title: "Ver Estadísticas",
    description: "Reportes completos",
    icon: "bar-chart" as const,
    color: "bg-lavender-indigo", // lavender-indigo
  },
  {
    title: "Ajustar Plan",
    description: "Cambiar suscripción",
    icon: "settings" as const,
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
            onPress={() => console.log(`${action.title} pressed`)}
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
