import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hapticFeedback } from '../../utils/haptics';
import AlertModal from '../atoms/AlertModal';
import ButtonAtom from '../atoms/ButtonAtom';

interface AcceptMaintenanceModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: (scheduledDate: string, estimatedCost?: number) => Promise<void>;
  maintenanceTitle: string;
}

export default function AcceptMaintenanceModal({
  visible,
  onClose,
  onAccept,
  maintenanceTitle,
}: AcceptMaintenanceModalProps) {
  const [selectedHours, setSelectedHours] = useState(24); // Por defecto: mañana
  const [estimatedCost, setEstimatedCost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el modal de alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{title: string, message: string, type: 'error'} | null>(null);

  const getScheduledDate = (): Date => {
    const date = new Date();
    date.setHours(date.getHours() + selectedHours);
    return date;
  };

  const handleAccept = async () => {
    hapticFeedback.buttonPress();
    setIsLoading(true);

    try {
      const scheduledDate = getScheduledDate();
      const cost = estimatedCost ? parseFloat(estimatedCost) : undefined;
      await onAccept(scheduledDate.toISOString(), cost);
      
      hapticFeedback.success();
      handleClose();
    } catch (error) {
      hapticFeedback.error();
      setAlertData({ title: 'Error', message: 'No se pudo aceptar la solicitud', type: 'error' });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    setSelectedHours(24);
    setEstimatedCost('');
    onClose();
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

  const timeOptions = [
    { hours: 2, label: 'En 2 horas' },
    { hours: 4, label: 'En 4 horas' },
    { hours: 24, label: 'Mañana' },
    { hours: 48, label: 'En 2 días' },
    { hours: 72, label: 'En 3 días' },
  ];

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
              <Text className="text-2xl font-bold text-gray-900">
                Aceptar Solicitud
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
              >
                <FontAwesome name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Maintenance Title */}
            <View className="bg-blue-50 p-4 rounded-xl mb-6">
              <Text className="text-sm text-blue-600 font-semibold mb-1">
                Solicitud de Mantenimiento
              </Text>
              <Text className="text-base text-gray-900 font-medium">
                {maintenanceTitle}
              </Text>
            </View>

            {/* Scheduled Date Preview */}
            <View className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-4">
              <Text className="text-sm text-purple-600 font-medium mb-1">
                Fecha programada:
              </Text>
              <Text className="text-base text-gray-900 font-semibold">
                {formatDate(getScheduledDate())}
              </Text>
            </View>

            {/* Time Selector */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                ¿Cuándo puedes realizarlo? *
              </Text>
              <View className="space-y-2">
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.hours}
                    onPress={() => {
                      hapticFeedback.buttonPressLight();
                      setSelectedHours(option.hours);
                    }}
                    className={`p-4 rounded-xl border-2 ${
                      selectedHours === option.hours
                        ? 'bg-purple-50 border-purple-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        selectedHours === option.hours ? 'text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estimated Cost */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Costo Estimado (Opcional)
              </Text>
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
                  title="Aceptar"
                  onPress={handleAccept}
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
