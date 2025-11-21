import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { hapticFeedback } from '../../utils/haptics';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertModalProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  closeText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const alertConfig = {
  success: {
    gradientColors: ['#10B981', '#059669', '#047857'] as const,
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  error: {
    gradientColors: ['#EF4444', '#DC2626', '#B91C1C'] as const,
    icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
  info: {
    gradientColors: ['#3B82F6', '#2563EB', '#1D4ED8'] as const,
    icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  warning: {
    gradientColors: ['#F59E0B', '#D97706', '#B45309'] as const,
    icon: 'warning' as keyof typeof Ionicons.glyphMap,
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
};

export default function AlertModal({
  visible,
  type = 'info',
  title,
  message,
  onClose,
  closeText = 'Cerrar',
  icon,
}: AlertModalProps) {
  const config = alertConfig[type];
  const displayIcon = icon || config.icon;

  const handleClose = () => {
    hapticFeedback.buttonPressLight();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center p-6" 
        onPress={handleClose}
      >
        <Pressable 
          className="w-full max-w-[380px]"
          onPress={(e) => e.stopPropagation()}
        >
          <LinearGradient
            colors={config.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <View className="bg-white rounded-[22px] p-6">
              {/* Icono */}
              <View className="items-center mb-4">
                <View 
                  style={{ 
                    backgroundColor: config.bgColor,
                    padding: 16,
                    borderRadius: 100,
                  }}
                >
                  <Ionicons name={displayIcon} size={48} color={config.gradientColors[1]} />
                </View>
              </View>

              {/* Título */}
              <Text className="text-center text-2xl font-bold text-gray-900 mb-3">
                {title}
              </Text>

              {/* Mensaje */}
              <Text className="text-center text-base text-gray-700 leading-6 mb-6">
                {message}
              </Text>

              {/* Botón */}
              <TouchableOpacity 
                onPress={handleClose}
                className="items-center"
              >
                <LinearGradient
                  colors={config.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    paddingVertical: 14,
                    paddingHorizontal: 32,
                    minWidth: 120,
                    shadowColor: config.gradientColors[1],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Text className="text-white font-bold text-center text-base">
                    {closeText}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
