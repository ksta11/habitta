import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { Badge } from '../../../components/atoms/Badge';
import { Avatar, AvatarFallback } from '../../../components/atoms/Avatar';
import { router } from 'expo-router';

interface RecentApplication {
  id: string;
  applicantName: string;
  propertyTitle: string;
  status: string;
  applicationDate: string;
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  pre_approved: { label: "Pre-aprobada", variant: "warning" as const },
  approved: { label: "Aprobada", variant: "success" as const },
  rejected: { label: "Rechazada", variant: "error" as const },
  withdrawn: { label: "Retirada", variant: "info" as const },
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  
  // Función para generar iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  // Obtener configuración de estado, con fallback a 'secondary'
  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: "secondary" as const 
    };
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <View className="flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Últimas Solicitudes</CardTitle>
          <Pressable 
            className="flex-row items-center"
            onPress={() => router.push('/(owner)/(applications)')}
          >
            <Text className="text-violet text-sm font-medium mr-1">Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
          </Pressable>
        </View>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500 text-center">
              No hay solicitudes recientes
            </Text>
          </View>
        ) : (
          applications.slice(0, 5).map((app) => {
            const statusInfo = getStatusConfig(app.status);
            return (
              <View key={app.id} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <Avatar size="md">
                    <AvatarFallback className="bg-lavender-indigo/10">
                      <Text className="text-lavender-indigo font-medium">
                        {getInitials(app.applicantName)}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <View className="flex-1">
                    <Text className="font-medium text-sm text-erie-black" numberOfLines={1}>
                      {app.applicantName}
                    </Text>
                    <Text className="text-xs text-gray-600" numberOfLines={1}>
                      {app.propertyTitle}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatDate(app.applicationDate)}
                    </Text>
                  </View>
                </View>
                <Badge variant={statusInfo.variant}>
                  {statusInfo.label}
                </Badge>
              </View>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
