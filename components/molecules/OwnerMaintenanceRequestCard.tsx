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
  onComplete?: (requestId: string) => void;
  showActions?: boolean;
}

export default function OwnerMaintenanceRequestCard({
  request,
  onPress,
  onApprove,
  onReject,
  onComplete,
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

  // Obtener datos de categoría (opcional - no viene del backend por ahora)
  const categoryData = null;
  const priorityData = null;
  const statusData = MAINTENANCE_STATUSES[request.status];

  // Obtener variante del badge de estado
  const getStatusBadgeVariant = () => {
    switch (request.status) {
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'approved':
      case 'accepted':
      case 'confirmed':
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
    return 'default';
  };

  const handlePress = () => {
    if (onPress) {
      hapticFeedback.buttonPressLight();
      onPress(request.id_maintenance);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      hapticFeedback.buttonPress();
      onApprove(request.id_maintenance);
    }
  };

  const handleReject = () => {
    if (onReject) {
      hapticFeedback.buttonPress();
      onReject(request.id_maintenance);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      hapticFeedback.buttonPress();
      onComplete(request.id_maintenance);
    }
  };

  // Mostrar acciones solo para estados que lo permitan
  const canApprove = request.status === 'pending' || request.status === 'in_review';
  const canReject = request.status === 'pending' || request.status === 'in_review';
  const canComplete = request.status === 'confirmed' || request.status === 'in_progress';

  return (
    <Pressable onPress={handlePress}>
      <Card className="mb-4">
        {/* Header con Estado */}
        <View className="flex-row justify-between items-center mb-3">
          <Badge variant={getStatusBadgeVariant()}>
            {statusData.label}
          </Badge>
          <Text className="text-gray-500 text-sm">
            {formatDate(request.created_at)}
          </Text>
        </View>

        {/* Información de la Propiedad */}
        {request.property && (
          <View className="bg-violet-50 rounded-xl p-3 mb-3">
            <View className="flex-row items-center">
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
        )}

        {/* Información del Inquilino */}
        {request.user && (
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <FontAwesome name="user" size={14} color="#531A99" />
              <Text className="text-gray-600 text-sm ml-2">Solicitado por:</Text>
            </View>
            <Text className="text-erie-black font-semibold">
              {request.user.name}
            </Text>
            <Text className="text-gray-600 text-sm">
              {request.user.phone}
            </Text>
          </View>
        )}

        {/* Título */}
        <View className="mb-3">
          <Label text={request.title} size="lg" weight="bold" />
        </View>

        {/* Descripción */}
        <View className="bg-gray-50 rounded-2xl p-3 mb-3">
          <Text className="text-gray-700 text-sm" numberOfLines={3}>
            {request.description}
          </Text>
        </View>

        {/* Fechas */}
        <View className="border-t border-gray-200 pt-3 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Solicitado:</Text>
            <Text className="text-erie-black text-sm font-semibold">
              {formatDate(request.created_at)}
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
          
          {request.completed_date && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Completado:</Text>
              <Text className="text-green-600 text-sm font-semibold">
                {formatDate(request.completed_date)}
              </Text>
            </View>
          )}
        </View>

        {/* Costos */}
        {request.cost_estimate && (
          <View className="border-t border-gray-200 pt-3 mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-sm">Costo Estimado:</Text>
              <Text className="text-orange-600 font-semibold">
                {formatCurrency(request.cost_estimate)}
              </Text>
            </View>
          </View>
        )}

        {/* Alerta para trabajo confirmado - listo para realizar */}
        {canComplete && onComplete && (
          <View className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-3">
            <View className="flex-row items-center mb-2">
              <FontAwesome name="check-circle" size={20} color="#10b981" />
              <Text className="text-green-700 font-bold ml-2 text-base">
                {request.status === 'confirmed' ? '¡Trabajo Confirmado!' : '¡Trabajo en Progreso!'}
              </Text>
            </View>
            <Text className="text-green-600 text-sm mb-3">
              {request.status === 'confirmed' 
                ? 'El inquilino ha confirmado la fecha. Puedes proceder con el mantenimiento.'
                : 'El trabajo está en progreso. Marca como completado cuando termines.'
              }
            </Text>
            {request.scheduled_date && (
              <View className="bg-white rounded-lg p-3">
                <Text className="text-gray-600 text-xs mb-1">Fecha programada:</Text>
                <Text className="text-green-700 font-bold text-base">
                  {new Date(request.scheduled_date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Botones de Acción */}
        {showActions && (canApprove || canReject || canComplete) && (
          <View className="flex-row mt-3 gap-2">
            {canApprove && onApprove && (
              <Pressable
                onPress={handleApprove}
                className="flex-1 bg-green-600 rounded-full py-3 items-center"
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
            {canComplete && onComplete && (
              <Pressable
                onPress={handleComplete}
                className="flex-1 bg-green-600 rounded-xl py-3 items-center flex-row justify-center"
              >
                <FontAwesome name="check-circle" size={16} color="white" />
                <Text className="text-white-traffic font-bold ml-2">Marcar Completado</Text>
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
