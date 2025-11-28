import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RenterApplication } from '../../interfaces/application/RenterApplicationInterface';
import { hapticFeedback } from '../../utils/haptics';
import ButtonAtom from '../atoms/ButtonAtom';
import PhoneCallButton from '../atoms/PhoneCallButton';
import WhatsAppButton from '../atoms/WhatsAppButton';

interface ApplicationDetailModalProps {
  visible: boolean;
  application: RenterApplication | null;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  title?: string;
}

export default function ApplicationDetailModal({
  visible,
  application,
  onClose,
  onConfirm,
  confirmText = 'Aceptar Solicitud',
  title = 'Detalles de la Solicitud',
}: ApplicationDetailModalProps) {
  const insets = useSafeAreaInsets();
  
  if (!application) return null;

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    onClose();
  };

  const handleConfirm = () => {
    hapticFeedback.buttonPress();
    onConfirm();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable 
          className="flex-1" 
          onPress={handleClose}
        />
        
        <View className="bg-white rounded-t-[32px] h-[90%] shadow-2xl">
          {/* Header */}
          <View className="p-6 pb-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900 flex-1">
                {title}
              </Text>
              <Pressable 
                onPress={handleClose} 
                className="p-2 -mr-2"
              >
                <Ionicons name="close" size={28} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          {/* Contenido */}
          <ScrollView 
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Imágenes de la Propiedad */}
            <View className="mb-6">
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                {application.property.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image.url_image }}
                    className="w-72 h-48 rounded-3xl mr-3"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>

            {/* Información de la Propiedad */}
            <View className="mb-6">
              <View className="flex-row items-start mb-2">
                <Ionicons name="home" size={24} color="#6D28D9" />
                <View className="flex-1 ml-3">
                  <Text className="text-xl font-bold text-gray-900 mb-1">
                    {application.property.title}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {application.property.address}
                    </Text>
                  </View>
                </View>
              </View>

              <LinearGradient
                colors={['#6D28D9', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl p-4 mt-3"
              >
                <Text className="text-white/90 text-sm mb-1">Renta Mensual</Text>
                <Text className="text-white text-3xl font-bold">
                  ${application.property.price.toLocaleString()}
                  <Text className="text-xl text-white/80"> /mes</Text>
                </Text>
              </LinearGradient>
            </View>

            {/* Información del Propietario */}
            <View className="bg-gray-50 rounded-3xl p-5 mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-lavender-indigo/10 p-2.5 rounded-full">
                  <Ionicons name="person" size={20} color="#6D28D9" />
                </View>
                <Text className="text-lg font-bold text-gray-900 ml-3">
                  Propietario
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={18} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2 mr-2">Nombre:</Text>
                  <Text className="text-sm font-semibold text-gray-900 flex-1">
                    {application.property.owner.name}
                  </Text>
                </View>

                {application.status !== 'pending' && (
                  <View>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="call-outline" size={18} color="#6B7280" />
                      <Text className="text-sm text-gray-600 ml-2 mr-2">Teléfono:</Text>
                      <Text className="text-sm font-semibold text-gray-900 flex-1">
                        {application.property.owner.phone}
                      </Text>
                    </View>
                    <View className="flex-row gap-2 mt-2">
                      <WhatsAppButton
                        phoneNumber={application.property.owner.phone}
                        message={`Hola, me interesa la propiedad "${application.property.title}". Me gustaría obtener más información.`}
                        variant="secondary"
                      />
                      <PhoneCallButton
                        phoneNumber={application.property.owner.phone}
                        variant="secondary"
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Tu Mensaje */}
            <View className="bg-lavender-indigo/5 rounded-3xl p-5 mb-6">
              <View className="flex-row items-center mb-3">
                <View className="bg-lavender-indigo/10 p-2.5 rounded-full">
                  <Ionicons name="chatbubble-ellipses" size={20} color="#6D28D9" />
                </View>
                <Text className="text-lg font-bold text-gray-900 ml-3">
                  Tu Mensaje
                </Text>
              </View>
              <Text className="text-sm text-gray-700 leading-6">
                "{application.description}"
              </Text>
            </View>

            {/* Información de la Solicitud */}
            <View className="bg-blue-50 rounded-3xl p-5 mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-blue-500/10 p-2.5 rounded-full">
                  <Ionicons name="document-text" size={20} color="#3B82F6" />
                </View>
                <Text className="text-lg font-bold text-gray-900 ml-3">
                  Detalles de la Solicitud
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2 mr-2">Fecha de solicitud:</Text>
                  <Text className="text-sm font-semibold text-gray-900 flex-1">
                    {formatDate(application.application_date)}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2 mr-2">ID de solicitud:</Text>
                  <Text className="text-sm font-mono text-gray-900 flex-1">
                    {application.id.slice(0, 8)}...
                  </Text>
                </View>
              </View>
            </View>

            {/* Nota Importante */}
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="warning" size={20} color="#F59E0B" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-amber-900 mb-1">
                    Importante
                  </Text>
                  <Text className="text-xs text-amber-800 leading-5">
                    Al aceptar esta solicitud, confirmas tu interés en rentar esta propiedad. 
                    El propietario recibirá una notificación y podrá proceder con el proceso de arrendamiento.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer con botones */}
          <View className="px-6 pt-4 border-t border-gray-100" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <ButtonAtom
                  title="Cancelar"
                  onPress={handleClose}
                  variant="outline"
                  size="large"
                  fullWidth
                />
              </View>
              
              <View className="flex-1">
                <ButtonAtom
                  title={confirmText}
                  onPress={handleConfirm}
                  variant="habitta-primary"
                  size="large"
                  icon="checkmark-circle"
                  iconPosition="left"
                  fullWidth
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
