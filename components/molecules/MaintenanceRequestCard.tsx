import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  MAINTENANCE_STATUSES,
  MaintenanceRequest
} from '../../interfaces/MaintenanceInterface';
import { hapticFeedback } from '../../utils/haptics';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import Label from '../atoms/Label';

interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
  onCancel?: (requestId: string) => void;
  onViewDetails?: (requestId: string) => void;
  showPropertyInfo?: boolean;
}

export default function MaintenanceRequestCard({
  request,
  onCancel,
  onViewDetails,
  showPropertyInfo = false,
}: MaintenanceRequestCardProps) {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Obtener datos de categoría
  const categoryData = MAINTENANCE_CATEGORIES[request.category];

  // Obtener datos de prioridad
  const priorityData = MAINTENANCE_PRIORITIES[request.priority];

  // Obtener datos de estado
  const statusData = MAINTENANCE_STATUSES[request.status];

  // Obtener variante del badge de estado
  const getStatusBadgeVariant = () => {
    switch (request.status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'approved':
        return 'success';
      case 'in_review':
        return 'info';
      case 'pending':
        return 'warning';
      case 'rejected':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Obtener variante del badge de prioridad
  const getPriorityBadgeVariant = () => {
    switch (request.priority) {
      case 'urgent':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card className="mb-4">
      {/* Header con Estado y Prioridad */}
      <View className="flex-row justify-between items-center mb-3">
        <Badge variant={getStatusBadgeVariant()}>
          {statusData.label}
        </Badge>
        <Badge variant={getPriorityBadgeVariant()}>
          Prioridad: {priorityData.label}
        </Badge>
      </View>

      {/* Título y Categoría */}
      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <FontAwesome 
            name={categoryData.icon as any} 
            size={18} 
            color="#531A99" 
          />
          <Text className="text-gray-600 ml-2 capitalize">{categoryData.label}</Text>
        </View>
        <Label text={request.title} size="lg" weight="bold" />
      </View>

      {/* Descripción */}
      <View className="bg-gray-50 rounded-2xl p-3 mb-3">
        <Text className="text-gray-700 text-sm" numberOfLines={3}>
          {request.description}
        </Text>
      </View>

      {/* Información de la Propiedad (opcional) */}
      {showPropertyInfo && request.property_title && (
        <View className="border-t border-gray-200 pt-3 mb-3">
          <Text className="text-gray-600 text-sm mb-1">Propiedad:</Text>
          <Text className="text-erie-black font-semibold">{request.property_title}</Text>
          {request.property_address && (
            <View className="flex-row items-center mt-1">
              <FontAwesome name="map-marker" size={12} color="#6b7280" />
              <Text className="text-gray-600 text-xs ml-1">{request.property_address}</Text>
            </View>
          )}
        </View>
      )}

      {/* Imágenes (si existen) */}
      {request.images && request.images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {request.images.map((image, index) => (
            <Image
              key={image.id || index}
              source={{ uri: image.url_image }}
              className="w-24 h-24 rounded-xl mr-2"
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Información de Fechas */}
      <View className="border-t border-gray-200 pt-3 mb-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600 text-sm">Solicitado:</Text>
          <Text className="text-erie-black text-sm font-medium">
            {formatDate(request.request_date)}
          </Text>
        </View>
        
        {request.scheduled_date && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Fecha Programada:</Text>
            <Text className="text-violet text-sm font-medium">
              {formatDate(request.scheduled_date)}
            </Text>
          </View>
        )}
        
        {request.completion_date && (
          <View className="flex-row justify-between">
            <Text className="text-gray-600 text-sm">Completado:</Text>
            <Text className="text-green-600 text-sm font-medium">
              {formatDate(request.completion_date)}
            </Text>
          </View>
        )}
      </View>

      {/* Notas del Propietario */}
      {request.owner_notes && (
        <View className="bg-violet/5 rounded-2xl p-3 mb-3">
          <Label text="Notas del Propietario" size="sm" weight="semibold" />
          <Text className="text-gray-700 text-sm mt-1">
            {request.owner_notes}
          </Text>
        </View>
      )}

      {/* Costos (si existen) */}
      {(request.estimated_cost || request.actual_cost) && (
        <View className="bg-gray-50 rounded-2xl p-3 mb-3">
          {request.estimated_cost && (
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600 text-sm">Costo Estimado:</Text>
              <Text className="text-erie-black text-sm font-semibold">
                ${request.estimated_cost.toLocaleString()}
              </Text>
            </View>
          )}
          {request.actual_cost && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Costo Final:</Text>
              <Text className="text-violet text-sm font-bold">
                ${request.actual_cost.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Botones de Acción */}
      <View className="flex-row gap-2">
        {onViewDetails && (
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPressLight();
              onViewDetails(request.id);
            }}
            className="flex-1 flex-row items-center justify-center bg-violet rounded-xl py-3"
          >
            <FontAwesome name="eye" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Ver Detalles</Text>
          </Pressable>
        )}

        {onCancel && request.status === 'pending' && (
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPress();
              onCancel(request.id);
            }}
            className="flex-1 flex-row items-center justify-center bg-red-100 rounded-xl py-3"
          >
            <FontAwesome name="times" size={16} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2">Cancelar</Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}
