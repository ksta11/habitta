import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Lease } from '../../interfaces/LeaseInterface';
import { hapticFeedback } from '../../utils/haptics';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import Label from '../atoms/Label';

interface LeaseCardProps {
  lease: Lease;
  onContactOwner?: () => void;
  onViewContract?: () => void;
}

export default function LeaseCard({ lease, onContactOwner, onViewContract }: LeaseCardProps) {
  // Formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calcular días restantes del contrato
  const getDaysRemaining = () => {
    const endDate = new Date(lease.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  // Obtener color del badge según el estado
  const getStatusBadgeColor = () => {
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

  // Obtener texto del estado
  const getStatusText = () => {
    switch (lease.status) {
      case 'active':
        return 'Activo';
      case 'pending_renewal':
        return 'Renovación Pendiente';
      case 'completed':
        return 'Finalizado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return lease.status;
    }
  };

  // Función para llamar al propietario
  const handleCallOwner = () => {
    hapticFeedback.buttonPressLight();
    const phoneUrl = `tel:${lease.owner.phone}`;
    Linking.openURL(phoneUrl);
  };

  // Función para enviar email al propietario
  const handleEmailOwner = () => {
    hapticFeedback.buttonPressLight();
    const emailUrl = `mailto:${lease.owner.email}`;
    Linking.openURL(emailUrl);
  };

  return (
    <Card className="mb-4">
      {/* Header con Imagen y Estado */}
      <View className="mb-4">
        <Image
          source={{ 
            uri: lease.property.images[0]?.url_image || 'https://via.placeholder.com/400x200'
          }}
          className="w-full h-48 rounded-2xl"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3">
          <Badge variant={getStatusBadgeColor()}>
            {getStatusText()}
          </Badge>
        </View>
      </View>

      {/* Información de la Propiedad */}
      <View className="mb-4">
        <Label text={lease.property.title} size="xl" weight="bold" />
        <View className="flex-row items-center mt-2">
          <FontAwesome name="map-marker" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-2">{lease.property.address}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <FontAwesome name="building" size={14} color="#6b7280" />
          <Text className="text-gray-600 ml-2 capitalize">{lease.property.type}</Text>
          <Text className="text-gray-400 mx-2">•</Text>
          <FontAwesome name="bed" size={14} color="#6b7280" />
          <Text className="text-gray-600 ml-1">{lease.property.rooms}</Text>
          <Text className="text-gray-400 mx-2">•</Text>
          <FontAwesome name="bath" size={14} color="#6b7280" />
          <Text className="text-gray-600 ml-1">{lease.property.bathrooms}</Text>
        </View>
      </View>

      {/* Información del Contrato */}
      <View className="bg-violet/5 rounded-2xl p-4 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-gray-600 text-sm">Renta Mensual</Text>
            <Text className="text-violet text-2xl font-bold">
              ${lease.monthly_rent.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-gray-600 text-sm text-right">Día de Pago</Text>
            <Text className="text-erie-black text-xl font-semibold text-right">
              {lease.payment_day}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-200 pt-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Inicio del Contrato</Text>
            <Text className="text-erie-black font-medium">
              {formatDate(lease.start_date)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Fin del Contrato</Text>
            <Text className="text-erie-black font-medium">
              {formatDate(lease.end_date)}
            </Text>
          </View>
          {lease.status === 'active' && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Días Restantes</Text>
              <Text className={`font-semibold ${daysRemaining < 30 ? 'text-red-500' : 'text-green-600'}`}>
                {daysRemaining} días
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Información del Propietario */}
      <View className="bg-gray-50 rounded-2xl p-4 mb-4">
        <View className="mb-3">
          <Label text="Propietario" size="md" weight="semibold" />
        </View>
        
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-violet rounded-full flex items-center justify-center">
            <Text className="text-white text-xl font-bold">
              {lease.owner.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-erie-black font-semibold text-base">
              {lease.owner.name}
            </Text>
            <Text className="text-gray-600 text-sm">{lease.owner.email}</Text>
          </View>
        </View>

        {/* Botones de Contacto */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={handleCallOwner}
            className="flex-1 flex-row items-center justify-center bg-violet rounded-xl py-3"
          >
            <FontAwesome name="phone" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Llamar</Text>
          </Pressable>

          <Pressable
            onPress={handleEmailOwner}
            className="flex-1 flex-row items-center justify-center bg-gray-200 rounded-xl py-3"
          >
            <FontAwesome name="envelope" size={16} color="#531A99" />
            <Text className="text-violet font-semibold ml-2">Email</Text>
          </Pressable>
        </View>
      </View>

      {/* Botón Ver Contrato */}
      {lease.contract_url && onViewContract && (
        <Pressable
          onPress={() => {
            hapticFeedback.buttonPressLight();
            onViewContract();
          }}
          className="flex-row items-center justify-center bg-gray-100 rounded-xl py-3"
        >
          <FontAwesome name="file-text" size={18} color="#531A99" />
          <Text className="text-violet font-semibold ml-2">Ver Contrato</Text>
        </Pressable>
      )}
    </Card>
  );
}
