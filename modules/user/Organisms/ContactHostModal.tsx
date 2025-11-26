import React, { useState } from 'react';
import { Alert, Modal, Text, TextInput, View } from 'react-native';
import ButtonAtom from '../../../components/atoms/ButtonAtom';
import { createApplication } from '../../../libs/application/api-service';
import { hapticFeedback } from '../../../utils/haptics';
import { standarPrimaryButton, standarPrimaryOutlineButton } from '../../../utils/TokensDesing';

interface ContactHostModalProps {
  visible: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  onSuccess?: () => void; // Callback opcional para cuando se crea exitosamente
}

export default function ContactHostModal({ 
  visible, 
  onClose, 
  propertyTitle, 
  propertyId,
  onSuccess
}: ContactHostModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      hapticFeedback.error();
      Alert.alert("Error", "Por favor ingresa un mensaje");
      return;
    }

    if (message.trim().length < 10) {
      hapticFeedback.error();
      Alert.alert("Error", "El mensaje debe tener al menos 10 caracteres");
      return;
    }

    if (message.trim().length > 150) {
      hapticFeedback.error();
      Alert.alert("Error", "El mensaje no puede exceder los 150 caracteres");
      return;
    }

    // Haptic al presionar enviar
    hapticFeedback.buttonPress();
    setIsLoading(true);
    
    try {
      const result = await createApplication({
        id_property: propertyId,
        description: message.trim()
      });

      if (result.success) {
        hapticFeedback.success();
        setMessage(''); // Limpiar el mensaje
        onClose(); // Cerrar el modal
        Alert.alert("¡Éxito!", "Tu solicitud ha sido enviada al anfitrión.");
        
        // Llamar callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }
      } else {
        hapticFeedback.error();
        Alert.alert("Error", result.message || "No se pudo enviar la solicitud");
      }
    } catch (error) {
      hapticFeedback.error();
      console.error('Error al crear application:', error);
      Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    setMessage(''); // Limpiar el mensaje al cerrar
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Header */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Contactar anfitrión
            </Text>
            <Text className="text-sm text-gray-600">
              Propiedad: {propertyTitle}
            </Text>
          </View>

          {/* TextInput */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Escribe tu mensaje:
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ej: Hola, estoy interesado en tu propiedad..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={150}
              className="border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-gray-50"
              style={{ minHeight: 100 }}
            />
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ButtonAtom
                title="Cancelar"
                onPress={handleClose}
                variant="outline"
                size="medium"
                fullWidth
                className={standarPrimaryOutlineButton}
              />
            </View>
            <View className="flex-1">
              <ButtonAtom
                title="Enviar"
                onPress={handleSend}
                variant="habitta-primary"
                size="medium"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className={standarPrimaryButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}