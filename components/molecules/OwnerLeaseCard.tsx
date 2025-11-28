import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { OwnerLease } from '../../interfaces/owner/OwnerLeaseInterface';
import { hapticFeedback } from '../../utils/haptics';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import Label from '../atoms/Label';

interface OwnerLeaseCardProps {
  lease: OwnerLease;
  onPress?: (leaseId: string) => void;
  onContactRenter?: (phone: string, email: string) => void;
}

export default function OwnerLeaseCard({
  lease,
  onPress,
  onContactRenter,
}: OwnerLeaseCardProps) {
  // Formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calcular días restantes
  const calculateDaysRemaining = () => {
    const endDate = new Date(lease.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Variante del badge según estado
  const getStatusBadgeVariant = () => {
    switch (lease.status) {
      case 'active':
        return 'success';
      case 'pending_renewal':
        return 'warning';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Label del estado
  const getStatusLabel = () => {
    switch (lease.status) {
      case 'active':
        return 'Activo';
      case 'pending_renewal':
        return 'Renovación Pendiente';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      hapticFeedback.buttonPressLight();
      onPress(lease.id);
    }
  };

  const handleCallRenter = () => {
    hapticFeedback.buttonPressLight();
    Linking.openURL(`tel:${lease.renter.phone}`);
  };

  const handleEmailRenter = () => {
    hapticFeedback.buttonPressLight();
    Linking.openURL(`mailto:${lease.renter.email}`);
  };

  return (
    <Pressable onPress={handleCardPress}>
      <Card className="mb-4">
        {/* Header: Propiedad con imagen */}
        <View className="flex-row mb-3">
          {lease.property.images && lease.property.images.length > 0 && (
            <Image
              source={{ uri: lease.property.images[0].url_image }}
              className="w-20 h-20 rounded-xl mr-3"
              resizeMode="cover"
            />
          )}
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-2">
                <Label text={lease.property.title} size="md" weight="bold" />
                <Text className="text-gray-600 text-sm mt-1">
                  {lease.property.address}
                </Text>
              </View>
              <Badge variant={getStatusBadgeVariant()}>
                {getStatusLabel()}
              </Badge>
            </View>
          </View>
        </View>

        {/* Información del Inquilino */}
        <View className="bg-violet-50 rounded-2xl p-3 mb-3">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="user" size={16} color="#531A99" />
            <Text className="text-gray-600 text-sm ml-2 font-semibold">Inquilino:</Text>
          </View>
          <Text className="text-erie-black font-bold text-base mb-1">
            {lease.renter.name}
          </Text>
          <View className="flex-row mt-2">
            <Pressable
              onPress={handleCallRenter}
              className="bg-lavender-indigo rounded-full px-4 py-2 mr-2 flex-row items-center"
            >
              <FontAwesome name="phone" size={14} color="#ffffff" />
              <Text className="text-white-traffic font-semibold ml-2 text-sm">
                Llamar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleEmailRenter}
              className="bg-white-traffic border border-lavender-indigo rounded-full px-4 py-2 flex-row items-center"
            >
              <FontAwesome name="envelope" size={14} color="#531A99" />
              <Text className="text-lavender-indigo font-semibold ml-2 text-sm">
                Email
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Información del Contrato */}
        <View className="border-t border-gray-200 pt-3 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Renta Mensual:</Text>
            <Text className="text-lavender-indigo font-bold text-base">
              {formatCurrency(lease.monthly_rent)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Inicio:</Text>
            <Text className="text-erie-black font-semibold text-sm">
              {formatDate(lease.start_date)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Fin:</Text>
            <Text className="text-erie-black font-semibold text-sm">
              {formatDate(lease.end_date)}
            </Text>
          </View>
          {lease.status === 'active' && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600 text-sm">Días Restantes:</Text>
              <Text
                className={`font-bold text-sm ${
                  isExpiringSoon ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {daysRemaining > 0 ? `${daysRemaining} días` : 'Expirado'}
              </Text>
            </View>
          )}
        </View>

        {/* Alerta de Expiración */}
        {isExpiringSoon && lease.status === 'active' && (
          <View className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
            <View className="flex-row items-center">
              <FontAwesome name="warning" size={16} color="#f97316" />
              <Text className="text-orange-600 text-sm font-semibold ml-2">
                Contrato próximo a expirar ({daysRemaining} días)
              </Text>
            </View>
          </View>
        )}

        {/* Stats de Pagos y Mantenimiento */}
        <View className="flex-row justify-between">
          {/* Pagos */}
          <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
            <View className="flex-row items-center mb-1">
              <FontAwesome name="check-circle" size={14} color="#10b981" />
              <Text className="text-gray-600 text-xs ml-1">Pagos a Tiempo</Text>
            </View>
            <Text className="text-green-600 font-bold text-lg">
              {lease.payments_on_time || 0}
            </Text>
          </View>

          {/* Mantenimiento */}
          <View className="flex-1 bg-blue-50 rounded-xl p-3">
            <View className="flex-row items-center mb-1">
              <FontAwesome name="wrench" size={14} color="#3b82f6" />
              <Text className="text-gray-600 text-xs ml-1">Mantenimientos</Text>
            </View>
            <Text className="text-blue-600 font-bold text-lg">
              {lease.pending_maintenance_count || 0} pendientes
            </Text>
          </View>
        </View>

        {/* Botón Ver Detalles */}
        {/* {onPress && (
          <Pressable
            onPress={handleCardPress}
            className="mt-3 bg-lavender-indigo rounded-full py-3 items-center"
          >
            <Text className="text-white-traffic font-bold">Ver Detalles</Text>
          </Pressable>
        )} */}
      </Card>
    </Pressable>
  );
}
