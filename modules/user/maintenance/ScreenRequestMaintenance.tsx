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
import { z } from 'zod';
import Label from '../../../components/atoms/Label';
import { useAuth } from '../../../contexts/AuthContext';
import {
  CreateMaintenanceRequestDTO
} from '../../../interfaces/MaintenanceInterface';
import { hapticFeedback } from '../../../utils/haptics';
import { secureTextField } from '../../../utils/validation';
import { useActiveLease } from '../hooks/useActiveLease';
import { useMaintenanceRequests } from '../hooks/useMaintenanceRequests';

// 🔒 Schema de validación con Zod
const maintenanceRequestSchema = z.object({
  title: secureTextField(5, 100, 'El título contiene caracteres no permitidos'),
  description: secureTextField(10, 500, 'La descripción contiene caracteres no permitidos'),
});

export default function ScreenRequestMaintenance() {
  const router = useRouter();
  const { user } = useAuth();
  const { lease, loading: leaseLoading } = useActiveLease();
  const { createRequest, creating } = useMaintenanceRequests();

  // Estado del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Errores de validación
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  /**
   * 🔒 Validar formulario con Zod
   * Protege contra SQL injection, caracteres peligrosos y buffer overflow
   */
  const validateForm = (): boolean => {
    console.log('🔍 [MaintenanceRequest] Validando formulario...');
    
    const result = maintenanceRequestSchema.safeParse({
      title: title,
      description: description,
    });

    if (!result.success) {
      // Mapear errores de Zod a nuestro formato
      const newErrors: typeof errors = {};
      
      result.error.errors.forEach((error) => {
        const field = error.path[0] as 'title' | 'description';
        if (!newErrors[field]) {
          newErrors[field] = error.message;
        }
      });

      console.log('❌ [MaintenanceRequest] Validación falló:', newErrors);
      setErrors(newErrors);
      return false;
    }

    console.log('✅ [MaintenanceRequest] Validación exitosa');
    setErrors({});
    return true;
  };

  /**
   * Enviar solicitud
   */
  const handleSubmit = async () => {
    if (!lease) {
      console.log('❌ No hay arrendamiento activo');
      return;
    }

    if (!user) {
      console.log('❌ No hay usuario autenticado');
      return;
    }

    // Validar que tenemos todos los IDs necesarios
    if (!lease.id_property) {
      console.error('❌ Falta id_property en el lease');
      return;
    }

    // Obtener id_owner del lease o del owner anidado
    const ownerId = lease.id_owner || lease.owner?.id;
    if (!ownerId) {
      console.error('❌ No se pudo obtener id_owner del lease');
      console.log('📋 Lease data:', { 
        id_owner: lease.id_owner, 
        owner: lease.owner 
      });
      return;
    }

    if (!user.id) {
      console.error('❌ Falta id en el usuario');
      return;
    }

    if (!validateForm()) {
      hapticFeedback.error();
      return;
    }

    hapticFeedback.buttonPress();

    // Enviar todos los campos requeridos por el backend
    const requestData: CreateMaintenanceRequestDTO = {
      id_property: lease.id_property,
      id_owner: ownerId,
      id_user: user.id,
      title: title.trim(),
      description: description.trim(),
      created_by: 'user',
      responsibility: 'owner',
    };

    console.log('📤 Enviando solicitud de mantenimiento:', requestData);

    const success = await createRequest(requestData);

    if (success) {
      // Limpiar formulario
      setTitle('');
      setDescription('');
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
                // Limpiar error al escribir
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
            <Text className="text-gray-500 text-xs mt-1 text-right">
              {title.length}/100
            </Text>
          </View>

          {/* Categoría */}
          <View className="mb-6">
            <Label text="Categoría" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-3">
              Selecciona el tipo de mantenimiento
            </Text>
        
          </View>

          {/* Prioridad */}
          <View className="mb-6">
            <Label text="Prioridad" size="md" weight="semibold" />
            <Text className="text-gray-600 text-sm mb-3">
              ¿Qué tan urgente es?
            </Text>
  
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
