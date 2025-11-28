import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hapticFeedback } from '../../utils/haptics';
import AlertModal from '../atoms/AlertModal';
import ButtonAtom from '../atoms/ButtonAtom';

interface CompleteMaintenanceModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (actualCost?: number) => Promise<void>;
  maintenanceTitle: string;
  estimatedCost?: number;
  scheduledDate?: string;
}

export default function CompleteMaintenanceModal({
  visible,
  onClose,
  onComplete,
  maintenanceTitle,
  estimatedCost,
  scheduledDate,
}: CompleteMaintenanceModalProps) {
  const [actualCost, setActualCost] = useState(estimatedCost?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el modal de alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{title: string, message: string, type: 'error'} | null>(null);

  const handleComplete = async () => {
    hapticFeedback.buttonPress();
    setIsLoading(true);

    try {
      const cost = actualCost ? parseFloat(actualCost) : undefined;
      await onComplete(cost);
      
      hapticFeedback.success();
      handleClose();
    } catch (error) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'No se pudo completar el trabajo', type: 'error' });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    setActualCost('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View>
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
                <FontAwesome name="check-circle" size={24} color="#10b981" />
                <Text className="text-2xl font-bold text-gray-900 ml-2">
                  Completar Trabajo
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
            <View className="bg-green-50 p-4 rounded-xl mb-6">
              <Text className="text-sm text-green-600 font-semibold mb-1">
                Trabajo de Mantenimiento
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
                    Marcar como Completado
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    Al marcar este trabajo como completado, se notificará al inquilino 
                    y se actualizará el registro. Opcionalmente puedes ingresar el costo final.
                  </Text>
                </View>
              </View>
            </View>

            {/* Scheduled Date */}
            {scheduledDate && (
              <View className="bg-white border-2 border-gray-200 p-4 rounded-xl mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  📅 Fecha Programada
                </Text>
                <Text className="text-lg text-gray-900 font-semibold">
                  {formatDate(scheduledDate)}
                </Text>
              </View>
            )}

            {/* Cost Comparison */}
            <View className="mb-6">
              {estimatedCost && (
                <View className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl mb-3">
                  <Text className="text-sm text-yellow-600 mb-2">
                    💰 Costo Estimado
                  </Text>
                  <Text className="text-xl text-yellow-700 font-bold">
                    ${estimatedCost.toLocaleString()}
                  </Text>
                </View>
              )}
              
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Costo Final / Real {!estimatedCost && '(Opcional)'}
              </Text>
              <View className="flex-row items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <Text className="text-lg text-gray-600 mr-2">$</Text>
                <TextInput
                  value={actualCost}
                  onChangeText={setActualCost}
                  placeholder={estimatedCost ? estimatedCost.toString() : '0.00'}
                  keyboardType="decimal-pad"
                  className="flex-1 text-base text-gray-900"
                />
              </View>
              {estimatedCost && actualCost && parseFloat(actualCost) !== estimatedCost && (
                <View className="mt-2 flex-row items-center">
                  <FontAwesome 
                    name={parseFloat(actualCost) > estimatedCost ? 'arrow-up' : 'arrow-down'} 
                    size={14} 
                    color={parseFloat(actualCost) > estimatedCost ? '#ef4444' : '#10b981'} 
                  />
                  <Text className={`text-sm ml-2 ${parseFloat(actualCost) > estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                    {parseFloat(actualCost) > estimatedCost 
                      ? `$${(parseFloat(actualCost) - estimatedCost).toLocaleString()} más que el estimado`
                      : `$${(estimatedCost - parseFloat(actualCost)).toLocaleString()} menos que el estimado`
                    }
                  </Text>
                </View>
              )}
            </View>

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
                  title="Completar"
                  onPress={handleComplete}
                  variant="success"
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

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
