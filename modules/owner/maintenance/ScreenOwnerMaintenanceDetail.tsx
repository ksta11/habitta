import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  MAINTENANCE_STATUSES
} from '../../../interfaces/MaintenanceInterface';
import { OwnerMaintenanceRequest } from '../../../interfaces/owner/OwnerMaintenanceInterface';
import { getOwnerMaintenanceRequestById } from '../../../libs/owner/maintenance/api-service';
import { hapticFeedback } from '../../../utils/haptics';
import { Badge } from '../../../components/atoms/Badge';
import { useOwnerMaintenanceRequests } from '../hooks';

export default function ScreenOwnerMaintenanceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<OwnerMaintenanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  const {
    approveRequest,
    rejectRequest,
    scheduleWork,
    completeWork,
    processing,
  } = useOwnerMaintenanceRequests();

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const response = await getOwnerMaintenanceRequestById(id);
      if (response.success && response.data) {
        setRequest(response.data);
      } else {
        Alert.alert('Error', response.message || 'No se pudo cargar la solicitud');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar solicitud:', error);
      Alert.alert('Error', 'Error al cargar la solicitud');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    hapticFeedback.buttonPress();
    const cost = estimatedCost ? parseFloat(estimatedCost) : undefined;
    const success = await approveRequest(id, cost, undefined, notes);
    if (success) {
      await loadRequest();
      setShowApproveForm(false);
      setEstimatedCost('');
      setNotes('');
    }
  };

  const handleReject = () => {
    hapticFeedback.buttonPress();
    Alert.alert(
      'Rechazar Solicitud',
      '¿Estás seguro de que quieres rechazar esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            const success = await rejectRequest(id, notes || 'Solicitud rechazada por el propietario');
            if (success) {
              await loadRequest();
            }
          },
        },
      ]
    );
  };

  const handleCallRenter = () => {
    if (request) {
      hapticFeedback.buttonPressLight();
      Linking.openURL(`tel:${request.renter.phone}`);
    }
  };

  const handleEmailRenter = () => {
    if (request) {
      hapticFeedback.buttonPressLight();
      Linking.openURL(`mailto:${request.renter.email}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white-traffic justify-center items-center">
        <ActivityIndicator size="large" color="#531A99" />
        <Text className="text-gray-500 mt-4">Cargando solicitud...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View className="flex-1 bg-white-traffic justify-center items-center">
        <Text className="text-gray-500">Solicitud no encontrada</Text>
      </View>
    );
  }

  const categoryData = MAINTENANCE_CATEGORIES[request.category];
  const priorityData = MAINTENANCE_PRIORITIES[request.priority];
  const statusData = MAINTENANCE_STATUSES[request.status];

  const canApprove = request.status === 'pending' || request.status === 'in_review';
  const canReject = request.status === 'pending' || request.status === 'in_review';

  return (
    <View className="flex-1 bg-white-traffic">
      {/* Header */}
      <View className="bg-lavender-indigo p-6 pt-12 pb-6">
        <Pressable onPress={() => router.back()} className="mb-4">
          <FontAwesome name="arrow-left" size={24} color="#ffffff" />
        </Pressable>
        <Text className="text-white-traffic text-2xl font-semibold">
          Detalle de Solicitud
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Estado y Prioridad */}
          <View className="flex-row justify-between mb-4">
            <Badge variant="info">{statusData.label}</Badge>
            <Badge variant={request.priority === 'high' || request.priority === 'urgent' ? 'error' : 'warning'}>
              {priorityData.label}
            </Badge>
          </View>

          {/* Propiedad */}
          <View className="bg-violet-50 rounded-xl p-4 mb-4">
            <View className="flex-row">
              {request.property.images && request.property.images.length > 0 && (
                <Image
                  source={{ uri: request.property.images[0].url_image }}
                  className="w-20 h-20 rounded-lg mr-3"
                />
              )}
              <View className="flex-1">
                <Text className="text-erie-black font-bold text-base mb-1">
                  {request.property.title}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {request.property.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Inquilino */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <Text className="text-gray-600 text-sm mb-2">Solicitado por:</Text>
            <Text className="text-erie-black font-bold text-lg mb-1">
              {request.renter.name}
            </Text>
            <Text className="text-gray-600 text-sm mb-3">{request.renter.email}</Text>
            <View className="flex-row">
              <Pressable
                onPress={handleCallRenter}
                className="flex-1 bg-lavender-indigo rounded-full py-3 mr-2 flex-row items-center justify-center"
              >
                <FontAwesome name="phone" size={16} color="#ffffff" />
                <Text className="text-white-traffic font-semibold ml-2">Llamar</Text>
              </Pressable>
              <Pressable
                onPress={handleEmailRenter}
                className="flex-1 bg-white border border-lavender-indigo rounded-full py-3 flex-row items-center justify-center"
              >
                <FontAwesome name="envelope" size={16} color="#531A99" />
                <Text className="text-lavender-indigo font-semibold ml-2">Email</Text>
              </Pressable>
            </View>
          </View>

          {/* Categoría y Título */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <FontAwesome name={categoryData.icon as any} size={20} color="#531A99" />
              <Text className="text-gray-600 ml-2 text-base capitalize">
                {categoryData.label}
              </Text>
            </View>
            <Text className="text-erie-black font-bold text-xl">{request.title}</Text>
          </View>

          {/* Descripción */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-700">{request.description}</Text>
          </View>

          {/* Fechas */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <Text className="text-gray-600 font-semibold mb-3">Fechas:</Text>
            <View className="mb-2">
              <Text className="text-gray-600 text-sm">Solicitado:</Text>
              <Text className="text-erie-black font-semibold">
                {formatDate(request.request_date)}
              </Text>
            </View>
            {request.scheduled_date && (
              <View className="mb-2">
                <Text className="text-gray-600 text-sm">Programado:</Text>
                <Text className="text-blue-600 font-semibold">
                  {formatDate(request.scheduled_date)}
                </Text>
              </View>
            )}
            {request.completion_date && (
              <View>
                <Text className="text-gray-600 text-sm">Completado:</Text>
                <Text className="text-green-600 font-semibold">
                  {formatDate(request.completion_date)}
                </Text>
              </View>
            )}
          </View>

          {/* Notas del Owner */}
          {request.owner_notes && (
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <Text className="text-blue-700 font-semibold mb-2">Tus Notas:</Text>
              <Text className="text-blue-900">{request.owner_notes}</Text>
            </View>
          )}

          {/* Costos */}
          {(request.estimated_cost || request.actual_cost) && (
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <Text className="text-gray-600 font-semibold mb-3">Costos:</Text>
              {request.estimated_cost && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Estimado:</Text>
                  <Text className="text-orange-600 font-bold">
                    {formatCurrency(request.estimated_cost)}
                  </Text>
                </View>
              )}
              {request.actual_cost && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Real:</Text>
                  <Text className="text-green-600 font-bold">
                    {formatCurrency(request.actual_cost)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Formulario de Aprobación */}
          {showApproveForm && (
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <Text className="text-green-700 font-semibold mb-3">Aprobar Solicitud:</Text>
              <TextInput
                placeholder="Costo estimado (opcional)"
                keyboardType="numeric"
                value={estimatedCost}
                onChangeText={setEstimatedCost}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 mb-3"
              />
              <TextInput
                placeholder="Notas (opcional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 mb-3"
                style={{ textAlignVertical: 'top' }}
              />
              <View className="flex-row">
                <Pressable
                  onPress={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-green-600 rounded-full py-3 mr-2 items-center"
                >
                  <Text className="text-white font-bold">
                    {processing ? 'Aprobando...' : 'Confirmar Aprobación'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowApproveForm(false)}
                  className="flex-1 bg-gray-200 rounded-full py-3 items-center"
                >
                  <Text className="text-gray-700 font-bold">Cancelar</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Botones de Acción */}
          {!showApproveForm && (canApprove || canReject) && (
            <View className="flex-row mb-4">
              {canApprove && (
                <Pressable
                  onPress={() => setShowApproveForm(true)}
                  disabled={processing}
                  className="flex-1 bg-green-600 rounded-full py-4 mr-2 items-center"
                >
                  <Text className="text-white font-bold text-base">Aprobar</Text>
                </Pressable>
              )}
              {canReject && (
                <Pressable
                  onPress={handleReject}
                  disabled={processing}
                  className="flex-1 bg-red-600 rounded-full py-4 items-center"
                >
                  <Text className="text-white font-bold text-base">Rechazar</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
