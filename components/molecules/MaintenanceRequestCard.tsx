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
  onConfirm?: (requestId: string) => void;
  onViewDetails?: (requestId: string) => void;
  showPropertyInfo?: boolean;
}

export default function MaintenanceRequestCard({
  request,
  onCancel,
  onConfirm,
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

  // Obtener datos de categoría (opcional - puede no existir en el backend)
  const categoryData = request.category ? MAINTENANCE_CATEGORIES[request.category] : null;

  // Obtener datos de prioridad (opcional - puede no existir en el backend)
  const priorityData = request.priority ? MAINTENANCE_PRIORITIES[request.priority] : null;

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
      case 'accepted':
      case 'confirmed':
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
    if (!request.priority) return 'default';
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
        {priorityData && (
          <Badge variant={getPriorityBadgeVariant()}>
            Prioridad: {priorityData.label}
          </Badge>
        )}
      </View>

      {/* Título y Categoría */}
      <View className="mb-3">
        {categoryData && (
          <View className="flex-row items-center mb-2">
            <FontAwesome 
              name={categoryData.icon as any} 
              size={18} 
              color="#531A99" 
            />
            <Text className="text-gray-600 ml-2 capitalize">{categoryData.label}</Text>
          </View>
        )}
        <Label text={request.title} size="lg" weight="bold" />
      </View>

      {/* Descripción */}
      <View className="bg-gray-50 rounded-2xl p-3 mb-3">
        <Text className="text-gray-700 text-sm" numberOfLines={3}>
          {request.description}
        </Text>
      </View>

      {/* Información de la Propiedad (opcional) */}
      {showPropertyInfo && request.property && (
        <View className="border-t border-gray-200 pt-3 mb-3">
          <Text className="text-gray-600 text-sm mb-1">Propiedad:</Text>
          <Text className="text-erie-black font-semibold">{request.property.title}</Text>
          {request.property.address && (
            <View className="flex-row items-center mt-1">
              <FontAwesome name="map-marker" size={12} color="#6b7280" />
              <Text className="text-gray-600 text-xs ml-1">{request.property.address}</Text>
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
            {formatDate(request.created_at)}
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
        
        {request.completed_date && (
          <View className="flex-row justify-between">
            <Text className="text-gray-600 text-sm">Completado:</Text>
            <Text className="text-green-600 text-sm font-medium">
              {formatDate(request.completed_date)}
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
      {(request.cost_estimate || request.actual_cost) && (
        <View className="bg-gray-50 rounded-2xl p-3 mb-3">
          {request.cost_estimate && (
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600 text-sm">Costo Estimado:</Text>
              <Text className="text-erie-black text-sm font-semibold">
                ${request.cost_estimate.toLocaleString()}
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

      {/* Alerta para confirmación requerida */}
      {request.status === 'accepted' && onConfirm && (
        <View className="bg-purple-50 border-2 border-purple-500 rounded-xl p-4 mb-3">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="calendar-check-o" size={20} color="#7c3aed" />
            <Text className="text-purple-700 font-bold ml-2 text-base">
              ¡Fecha Programada!
            </Text>
          </View>
          <Text className="text-purple-600 text-sm mb-3">
            El propietario ha aceptado tu solicitud y programó el mantenimiento. 
            Por favor, confirma que la fecha te funciona.
          </Text>
          {request.scheduled_date && (
            <View className="bg-white rounded-lg p-3 mb-3">
              <Text className="text-gray-600 text-xs mb-1">Fecha programada:</Text>
              <Text className="text-purple-700 font-bold text-lg">
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
          {request.cost_estimate && (
            <View className="bg-white rounded-lg p-3 mb-3">
              <Text className="text-gray-600 text-xs mb-1">Costo estimado:</Text>
              <Text className="text-gray-900 font-bold text-lg">
                ${request.cost_estimate.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Botones de Acción */}
      <View className="flex-row gap-2">
        {/* Botón de Confirmar (para status accepted) */}
        {onConfirm && request.status === 'accepted' && (
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPress();
              onConfirm(request.id_maintenance);
            }}
            className="flex-1 flex-row items-center justify-center bg-purple-600 rounded-xl py-3"
          >
            <FontAwesome name="check-circle" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Confirmar Fecha</Text>
          </Pressable>
        )}

        {onViewDetails && (
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPressLight();
              onViewDetails(request.id_maintenance);
            }}
            className={`${onConfirm && request.status === 'accepted' ? 'flex-1' : 'flex-1'} flex-row items-center justify-center bg-violet rounded-xl py-3`}
          >
            <FontAwesome name="eye" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Ver Detalles</Text>
          </Pressable>
        )}

        {onCancel && request.status === 'pending' && (
          <Pressable
            onPress={() => {
              hapticFeedback.buttonPress();
              onCancel(request.id_maintenance);
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
