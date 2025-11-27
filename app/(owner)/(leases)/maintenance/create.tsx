import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import AlertModal from '../../../../components/atoms/AlertModal';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import Label from '../../../../components/atoms/Label';
import { useOwnerLeases } from '../../../../modules/owner/hooks/useOwnerLeases';
import { useOwnerMaintenanceRequests } from '../../../../modules/owner/hooks/useOwnerMaintenanceRequests';
import { hapticFeedback } from '../../../../utils/haptics';

export default function ScreenCreateOwnerMaintenance() {
  const router = useRouter();
  const { leases, loading: leasesLoading } = useOwnerLeases();
  const { createRequest, creating } = useOwnerMaintenanceRequests();

  // Estados del formulario
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibility, setResponsibility] = useState<'owner' | 'user'>('owner');
  const [scheduledHours, setScheduledHours] = useState(24); // Por defecto mañana
  const [estimatedCost, setEstimatedCost] = useState('');

  // Estado para el modal de alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{title: string, message: string, type: 'error'} | null>(null);

  const getScheduledDate = (): Date => {
    const date = new Date();
    date.setHours(date.getHours() + scheduledHours);
    return date;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!selectedLeaseId) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'Debes seleccionar una propiedad arrendada', type: 'error' });
      setAlertVisible(true);
      return;
    }

    if (title.trim().length < 3) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'El título debe tener al menos 3 caracteres', type: 'error' });
      setAlertVisible(true);
      return;
    }

    if (description.trim().length < 10) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'La descripción debe tener al menos 10 caracteres', type: 'error' });
      setAlertVisible(true);
      return;
    }

    // Encontrar el lease seleccionado
    const selectedLease = leases.find(l => l.id === selectedLeaseId);
    if (!selectedLease) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'Arrendamiento no encontrado', type: 'error' });
      setAlertVisible(true);
      return;
    }

    // Crear solicitud (Escenario 2: owner-initiated)
    const success = await createRequest({
      id_property: selectedLease.id_property,
      id_owner: selectedLease.id_owner,
      id_user: selectedLease.id_renter,
      title: title.trim(),
      description: description.trim(),
      responsibility,
      scheduled_date: getScheduledDate().toISOString(), // OBLIGATORIO para escenario 2
      cost_estimate: estimatedCost ? parseFloat(estimatedCost) : undefined,
    });

    if (success) {
      // Limpiar formulario
      setSelectedLeaseId('');
      setTitle('');
      setDescription('');
      setResponsibility('owner');
      setScheduledHours(24);
      setEstimatedCost('');
      
      // Navegar a la lista
      router.back();
    }
  };

  if (leasesLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#531A99" />
        <Text className="text-gray-600 mt-4">Cargando propiedades...</Text>
      </View>
    );
  }

  // Filtrar solo leases activos
  const activeLeases = leases.filter(l => l.status === 'active');

  if (activeLeases.length === 0) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Header */}
            <View className="mb-6">
              <Pressable
                onPress={() => {
                  hapticFeedback.buttonPressLight();
                  router.back();
                }}
                className="flex-row items-center mb-4"
              >
                <FontAwesome name="arrow-left" size={20} color="#531A99" />
                <Text className="text-violet ml-2 font-semibold">Volver</Text>
              </Pressable>
              
              <Label text="Crear Mantenimiento" size="xl" weight="bold" />
              <Text className="text-gray-600 mt-2">
                Programa mantenimiento preventivo o reparaciones
              </Text>
            </View>

            {/* No hay propiedades arrendadas */}
            <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 items-center">
              <FontAwesome name="home" size={48} color="#f59e0b" />
              <Text className="text-yellow-800 font-semibold text-lg mt-4">
                No hay propiedades arrendadas
              </Text>
              <Text className="text-yellow-700 text-center mt-2">
                Necesitas tener al menos una propiedad arrendada para crear solicitudes de mantenimiento.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const selectedLease = leases.find(l => l.id === selectedLeaseId);
  const timeOptions = [
    { hours: 2, label: 'En 2 horas' },
    { hours: 4, label: 'En 4 horas' },
    { hours: 24, label: 'Mañana' },
    { hours: 48, label: 'En 2 días' },
    { hours: 72, label: 'En 3 días' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Pressable
              onPress={() => {
                hapticFeedback.buttonPressLight();
                router.back();
              }}
              className="flex-row items-center mb-4"
            >
              <FontAwesome name="arrow-left" size={20} color="#531A99" />
              <Text className="text-violet ml-2 font-semibold">Volver</Text>
            </Pressable>
            
            <Label text="Crear Mantenimiento" size="xl" weight="bold" />
            <Text className="text-gray-600 mt-2">
              Programa mantenimiento preventivo o reparaciones
            </Text>
          </View>

          {/* Seleccionar Propiedad Arrendada */}
          <View className="mb-6">
            <View className="mb-2">
              <Label text="Propiedad *" size="sm" weight="semibold" />
            </View>
            <Text className="text-gray-500 text-sm mb-3">
              Selecciona la propiedad arrendada para la cual deseas crear el mantenimiento
            </Text>
            
            {activeLeases.map((lease) => (
              <Pressable
                key={lease.id}
                onPress={() => {
                  hapticFeedback.selection();
                  setSelectedLeaseId(lease.id);
                }}
                className={`p-4 rounded-xl border-2 mb-3 ${
                  selectedLeaseId === lease.id
                    ? 'bg-purple-50 border-purple-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold mb-1 ${
                    selectedLeaseId === lease.id ? 'text-purple-700' : 'text-gray-900'
                  }`}
                >
                  {lease.property?.title || 'Propiedad'}
                </Text>
                <Text className="text-gray-600 text-sm mb-1">
                  {lease.property?.address}
                </Text>
                <View className="flex-row items-center mt-2">
                  <FontAwesome name="user" size={12} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-2">
                    Inquilino: {lease.renter?.name || 'N/A'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Título */}
          <View className="mb-6">
            <View className="mb-2">
              <Label text="Título *" size="sm" weight="semibold" />
            </View>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Revisión anual de caldera"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              maxLength={100}
            />
            <Text className="text-gray-500 text-xs mt-1">
              {title.length}/100 caracteres
            </Text>
          </View>

          {/* Descripción */}
          <View className="mb-6">
            <View className="mb-2">
              <Label text="Descripción *" size="sm" weight="semibold" />
            </View>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe el mantenimiento a realizar..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              style={{ minHeight: 100, textAlignVertical: 'top' }}
              maxLength={500}
            />
            <Text className="text-gray-500 text-xs mt-1">
              {description.length}/500 caracteres
            </Text>
          </View>

          {/* Responsabilidad */}
          <View className="mb-6">
            <View className="mb-2">
              <Label text="Responsabilidad *" size="sm" weight="semibold" />
            </View>
            <Text className="text-gray-500 text-sm mb-3">
              ¿Quién es responsable de este mantenimiento?
            </Text>
            
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  hapticFeedback.selection();
                  setResponsibility('owner');
                }}
                className={`flex-1 p-4 rounded-xl border-2 ${
                  responsibility === 'owner'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold text-center ${
                    responsibility === 'owner' ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  Propietario
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  hapticFeedback.selection();
                  setResponsibility('user');
                }}
                className={`flex-1 p-4 rounded-xl border-2 ${
                  responsibility === 'user'
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold text-center ${
                    responsibility === 'user' ? 'text-orange-700' : 'text-gray-700'
                  }`}
                >
                  Inquilino
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Fecha Programada Preview */}
          <View className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-4">
            <Text className="text-sm text-purple-600 font-medium mb-1">
              Fecha programada:
            </Text>
            <Text className="text-base text-gray-900 font-semibold">
              {formatDate(getScheduledDate())}
            </Text>
          </View>

          {/* Selector de Tiempo */}
          <View className="mb-6">
            <View className="mb-2">
              <Label text="¿Cuándo se realizará?" size="sm" weight="semibold" />
            </View>
            <View className="space-y-2">
              {timeOptions.map((option) => (
                <Pressable
                  key={option.hours}
                  onPress={() => {
                    hapticFeedback.buttonPressLight();
                    setScheduledHours(option.hours);
                  }}
                  className={`p-4 rounded-xl border-2 ${
                    scheduledHours === option.hours
                      ? 'bg-purple-50 border-purple-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      scheduledHours === option.hours ? 'text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Costo Estimado */}
          <View className="mb-8">
            <View className="mb-2">
              <Label text="Costo Estimado (Opcional)" size="sm" weight="semibold" />
            </View>
            <View className="flex-row items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
              <Text className="text-lg text-gray-600 mr-2">$</Text>
              <TextInput
                value={estimatedCost}
                onChangeText={setEstimatedCost}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="flex-1 text-base text-gray-900"
              />
            </View>
          </View>

          {/* Botón de Crear */}
          <ButtonAtom
            title={creating ? 'Creando...' : 'Crear Solicitud'}
            onPress={handleSubmit}
            variant="success"
            size="large"
            fullWidth
            loading={creating}
            disabled={creating || !selectedLeaseId || !title || !description}
          />
        </View>
      </ScrollView>

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
