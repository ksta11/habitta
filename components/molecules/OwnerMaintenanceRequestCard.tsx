import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  MAINTENANCE_STATUSES
} from '../../interfaces/MaintenanceInterface';
import { OwnerMaintenanceRequest } from '../../interfaces/owner/OwnerMaintenanceInterface';
import { hapticFeedback } from '../../utils/haptics';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import Label from '../atoms/Label';

interface OwnerMaintenanceRequestCardProps {
  request: OwnerMaintenanceRequest;
  onPress?: (requestId: string) => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  showActions?: boolean;
}

export default function OwnerMaintenanceRequestCard({
  request,
  onPress,
  onApprove,
  onReject,
  showActions = true,
}: OwnerMaintenanceRequestCardProps) {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Obtener datos de categoría
  const categoryData = MAINTENANCE_CATEGORIES[request.category];
  const priorityData = MAINTENANCE_PRIORITIES[request.priority];
  const statusData = MAINTENANCE_STATUSES[request.status];

  // Obtener variante del badge de estado
  const getStatusBadgeVariant = () => {
    switch (request.status) {
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'approved':
        return 'info';
      case 'in_review':
        return 'warning';
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

  const handlePress = () => {
    if (onPress) {
      hapticFeedback.buttonPressLight();
      onPress(request.id);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      hapticFeedback.buttonPress();
      onApprove(request.id);
    }
  };

  const handleReject = () => {
    if (onReject) {
      hapticFeedback.buttonPress();
      onReject(request.id);
    }
  };

  // Mostrar acciones solo para estados que lo permitan
  const canApprove = request.status === 'pending' || request.status === 'in_review';
  const canReject = request.status === 'pending' || request.status === 'in_review';

  return (
    <Pressable onPress={handlePress}>
      <Card className="mb-4">
        {/* Header con Estado y Prioridad */}
        <View className="flex-row justify-between items-center mb-3">
          <Badge variant={getStatusBadgeVariant()}>
            {statusData.label}
          </Badge>
          <Badge variant={getPriorityBadgeVariant()}>
            {priorityData.label}
          </Badge>
        </View>

        {/* Información de la Propiedad */}
        <View className="bg-violet-50 rounded-xl p-3 mb-3">
          <View className="flex-row items-center">
            {request.property.images && request.property.images.length > 0 && (
              <Image
                source={{ uri: request.property.images[0].url_image }}
                className="w-16 h-16 rounded-lg mr-3"
                resizeMode="cover"
              />
            )}
            <View className="flex-1">
              <Text className="text-erie-black font-bold text-sm mb-1">
                {request.property.title}
              </Text>
              <Text className="text-gray-600 text-xs" numberOfLines={1}>
                {request.property.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Información del Inquilino */}
        <View className="mb-3">
          <View className="flex-row items-center mb-1">
            <FontAwesome name="user" size={14} color="#531A99" />
            <Text className="text-gray-600 text-sm ml-2">Solicitado por:</Text>
          </View>
          <Text className="text-erie-black font-semibold">
            {request.renter.name}
          </Text>
          <Text className="text-gray-600 text-sm">
            {request.renter.phone}
          </Text>
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

        {/* Imágenes si existen */}
        {request.images && request.images.length > 0 && (
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 font-semibold">
              Imágenes ({request.images.length}):
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {request.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.url_image }}
                  className="w-24 h-24 rounded-lg mr-2"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Fechas */}
        <View className="border-t border-gray-200 pt-3 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Solicitado:</Text>
            <Text className="text-erie-black text-sm font-semibold">
              {formatDate(request.request_date)}
            </Text>
          </View>
          
          {request.scheduled_date && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Programado:</Text>
              <Text className="text-blue-600 text-sm font-semibold">
                {formatDate(request.scheduled_date)}
              </Text>
            </View>
          )}
          
          {request.completion_date && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Completado:</Text>
              <Text className="text-green-600 text-sm font-semibold">
                {formatDate(request.completion_date)}
              </Text>
            </View>
          )}
        </View>

        {/* Notas del Owner */}
        {request.owner_notes && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
            <View className="flex-row items-center mb-1">
              <FontAwesome name="sticky-note" size={14} color="#3b82f6" />
              <Text className="text-blue-700 text-sm font-semibold ml-2">
                Notas del Propietario:
              </Text>
            </View>
            <Text className="text-blue-900 text-sm">{request.owner_notes}</Text>
          </View>
        )}

        {/* Costos */}
        {(request.estimated_cost || request.actual_cost) && (
          <View className="border-t border-gray-200 pt-3 mb-3">
            {request.estimated_cost && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600 text-sm">Costo Estimado:</Text>
                <Text className="text-orange-600 font-semibold">
                  {formatCurrency(request.estimated_cost)}
                </Text>
              </View>
            )}
            {request.actual_cost && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">Costo Real:</Text>
                <Text className="text-green-600 font-bold">
                  {formatCurrency(request.actual_cost)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Calificación del Inquilino */}
        {request.status === 'completed' && request.renter_rating && (
          <View className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
            <View className="flex-row items-center mb-1">
              <FontAwesome name="star" size={14} color="#10b981" />
              <Text className="text-green-700 text-sm font-semibold ml-2">
                Calificación del Inquilino: {request.renter_rating}/5
              </Text>
            </View>
            {request.renter_review && (
              <Text className="text-green-900 text-sm mt-1">
                "{request.renter_review}"
              </Text>
            )}
          </View>
        )}

        {/* Botones de Acción */}
        {showActions && (canApprove || canReject) && (
          <View className="flex-row mt-3">
            {canApprove && onApprove && (
              <Pressable
                onPress={handleApprove}
                className="flex-1 bg-green-600 rounded-full py-3 mr-2 items-center"
              >
                <Text className="text-white-traffic font-bold">Aprobar</Text>
              </Pressable>
            )}
            {canReject && onReject && (
              <Pressable
                onPress={handleReject}
                className="flex-1 bg-red-600 rounded-full py-3 items-center"
              >
                <Text className="text-white-traffic font-bold">Rechazar</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Botón Ver Detalles para otros estados */}
        {onPress && !showActions && (
          <Pressable
            onPress={handlePress}
            className="mt-3 bg-lavender-indigo rounded-full py-3 items-center"
          >
            <Text className="text-white-traffic font-bold">Ver Detalles</Text>
          </Pressable>
        )}
      </Card>
    </Pressable>
  );
}
