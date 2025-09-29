import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { Badge } from '../../../components/atoms/Badge';
import { Avatar, AvatarFallback } from '../../../components/atoms/Avatar';

const applications = [
  {
    name: "María González",
    property: "Apartamento Centro",
    status: "pendiente",
    initials: "MG",
  },
  {
    name: "Carlos Ruiz",
    property: "Casa Residencial",
    status: "aceptada",
    initials: "CR",
  },
  {
    name: "Ana López",
    property: "Estudio Moderno",
    status: "rechazada",
    initials: "AL",
  },
];

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "secondary" as const },
  aceptada: { label: "Aceptada", variant: "success" as const },
  rechazada: { label: "Rechazada", variant: "error" as const },
};

export function RecentApplications() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <View className="flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Últimas Solicitudes</CardTitle>
          <Pressable 
            className="flex-row items-center"
            onPress={() => console.log('Ver todas pressed')}
          >
            <Text className="text-violet text-sm font-medium mr-1">Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
          </Pressable>
        </View>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((app, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Avatar size="md">
                <AvatarFallback className="bg-lavender-indigo/10">
                  <Text className="text-lavender-indigo font-medium">{app.initials}</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-medium text-sm text-erie-black">{app.name}</Text>
                <Text className="text-xs text-gray-600">{app.property}</Text>
              </View>
            </View>
            <Badge variant={statusConfig[app.status as keyof typeof statusConfig].variant}>
              {statusConfig[app.status as keyof typeof statusConfig].label}
            </Badge>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
