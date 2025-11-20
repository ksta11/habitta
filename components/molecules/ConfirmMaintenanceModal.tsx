import React, { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ButtonAtom from '../atoms/ButtonAtom';
import { hapticFeedback } from '../../utils/haptics';

interface ConfirmMaintenanceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  maintenanceTitle: string;
  scheduledDate: string;
  estimatedCost?: number;
}

export default function ConfirmMaintenanceModal({
  visible,
  onClose,
  onConfirm,
  maintenanceTitle,
  scheduledDate,
  estimatedCost,
}: ConfirmMaintenanceModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    hapticFeedback.buttonPress();
    setIsLoading(true);

    try {
      await onConfirm();
      hapticFeedback.success();
      handleClose();
    } catch (error) {
      hapticFeedback.error();
      Alert.alert('Error', 'No se pudo confirmar la fecha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 pb-8">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <FontAwesome name="calendar-check-o" size={24} color="#7c3aed" />
              <Text className="text-2xl font-bold text-gray-900 ml-2">
                Confirmar Fecha
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <FontAwesome name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Maintenance Title */}
          <View className="bg-purple-50 p-4 rounded-xl mb-6">
            <Text className="text-sm text-purple-600 font-semibold mb-1">
              Solicitud de Mantenimiento
            </Text>
            <Text className="text-base text-gray-900 font-medium">
              {maintenanceTitle}
            </Text>
          </View>

          {/* Info Message */}
          <View className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl mb-6">
            <View className="flex-row items-start">
              <FontAwesome name="info-circle" size={20} color="#3b82f6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-800 font-semibold mb-1">
                  Confirmación de Fecha
                </Text>
                <Text className="text-blue-700 text-sm">
                  El propietario ha programado el mantenimiento para la siguiente fecha. 
                  Al confirmar, aceptas que esta fecha te funciona.
                </Text>
              </View>
            </View>
          </View>

          {/* Scheduled Date */}
          <View className="bg-white border-2 border-purple-500 p-4 rounded-xl mb-4">
            <Text className="text-sm text-gray-600 mb-2">
              📅 Fecha Programada
            </Text>
            <Text className="text-xl text-purple-700 font-bold">
              {formatDate(scheduledDate)}
            </Text>
          </View>

          {/* Estimated Cost */}
          {estimatedCost && (
            <View className="bg-white border-2 border-gray-200 p-4 rounded-xl mb-6">
              <Text className="text-sm text-gray-600 mb-2">
                💰 Costo Estimado
              </Text>
              <Text className="text-xl text-gray-900 font-bold">
                ${estimatedCost.toLocaleString()}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ButtonAtom
                title="Cancelar"
                onPress={handleClose}
                variant="outline"
                size="medium"
                fullWidth
                disabled={isLoading}
              />
            </View>
            <View className="flex-1">
              <ButtonAtom
                title="Confirmar"
                onPress={handleConfirm}
                variant="habitta-primary"
                size="medium"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
