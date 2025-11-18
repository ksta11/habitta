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
import Label from '../../../components/atoms/Label';
import {
  CreateMaintenanceRequestDTO,
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  MaintenanceCategory,
  MaintenancePriority
} from '../../../interfaces/MaintenanceInterface';
import { hapticFeedback } from '../../../utils/haptics';
import { useActiveLease, useMaintenanceRequests } from '../hooks';

export default function ScreenRequestMaintenance() {
  const router = useRouter();
  const { lease, loading: leaseLoading } = useActiveLease();
  const { createRequest, creating } = useMaintenanceRequests();

  // Estado del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('other');
  const [priority, setPriority] = useState<MaintenancePriority>('medium');

  // Errores de validación
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  /**
   * Validar formulario
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (title.trim().length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Enviar solicitud
   */
  const handleSubmit = async () => {
    if (!lease) {
      console.log('❌ No hay arrendamiento activo');
      return;
    }

    if (!validateForm()) {
      hapticFeedback.error();
      return;
    }

    hapticFeedback.buttonPress();

    const requestData: CreateMaintenanceRequestDTO = {
      id_lease: lease.id,
      id_property: lease.id_property,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
    };

    const success = await createRequest(requestData);

    if (success) {
      // Limpiar formulario
      setTitle('');
      setDescription('');
      setCategory('other');
      setPriority('medium');
      setErrors({});

      // Volver a la pantalla anterior
      router.back();
    }
  };

  /**
   * Cancelar
   */
  const handleCancel = () => {
    hapticFeedback.buttonPressLight();
    router.back();
  };

  if (leaseLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#531A99" />
      </View>
    );
  }

  if (!lease) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <FontAwesome name="exclamation-circle" size={60} color="#ef4444" />
        <Text className="text-gray-800 text-lg font-semibold mt-4">
          No hay arrendamiento activo
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Necesitas un contrato activo para solicitar mantenimiento
        </Text>
        <Pressable
          onPress={handleCancel}
          className="bg-violet rounded-xl py-3 px-6 mt-6"
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-4 py-6">
          {/* Información de la Propiedad */}
          <View className="bg-violet/5 rounded-2xl p-4 mb-6">
            <Text className="text-gray-600 text-sm mb-1">Solicitud para:</Text>
            <Text className="text-erie-black font-bold text-lg">
              {lease.property.title}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              {lease.property.address}
            </Text>
          </View>

          {/* Título */}
          <View className="mb-6">
            <Label text="Título de la Solicitud" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-2">
              Describe brevemente el problema
            </Text>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Ej: Fuga de agua en el baño"
              className={`bg-gray-50 rounded-xl px-4 py-3 text-base ${
                errors.title ? 'border-2 border-red-500' : ''
              }`}
              maxLength={100}
            />
            {errors.title && (
              <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
            )}
          </View>

          {/* Categoría */}
          <View className="mb-6">
            <Label text="Categoría" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-3">
              Selecciona el tipo de mantenimiento
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(MAINTENANCE_CATEGORIES).map(([key, data]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    hapticFeedback.selection();
                    setCategory(key as MaintenanceCategory);
                  }}
                  className={`flex-row items-center px-4 py-2 rounded-xl ${
                    category === key ? 'bg-violet' : 'bg-gray-100'
                  }`}
                >
                  <FontAwesome
                    name={data.icon as any}
                    size={14}
                    color={category === key ? 'white' : '#531A99'}
                  />
                  <Text
                    className={`ml-2 text-sm font-medium ${
                      category === key ? 'text-white' : 'text-erie-black'
                    }`}
                  >
                    {data.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Prioridad */}
          <View className="mb-6">
            <Label text="Prioridad" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-3">
              ¿Qué tan urgente es?
            </Text>
            <View className="flex-row gap-2">
              {Object.entries(MAINTENANCE_PRIORITIES).map(([key, data]) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    hapticFeedback.selection();
                    setPriority(key as MaintenancePriority);
                  }}
                  className={`flex-1 py-3 rounded-xl ${
                    priority === key ? 'bg-violet' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      priority === key ? 'text-white' : 'text-erie-black'
                    }`}
                  >
                    {data.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Descripción */}
          <View className="mb-6">
            <Label text="Descripción Detallada" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-2">
              Explica el problema con el mayor detalle posible
            </Text>
            <TextInput
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              placeholder="Describe el problema, ubicación exacta, y cualquier otro detalle importante..."
              className={`bg-gray-50 rounded-xl px-4 py-3 text-base ${
                errors.description ? 'border-2 border-red-500' : ''
              }`}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.description}
              </Text>
            )}
            <Text className="text-gray-500 text-xs mt-1 text-right">
              {description.length}/500
            </Text>
          </View>

          {/* Botones */}
          <View className="flex-row gap-3 mb-8">
            <Pressable
              onPress={handleCancel}
              disabled={creating}
              className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
            >
              <Text className="text-erie-black font-semibold">Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={creating}
              className="flex-1 bg-violet rounded-xl py-4 items-center"
            >
              {creating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Enviar Solicitud</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
