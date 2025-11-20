import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    Text,
    View,
} from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastNotificationProps {
  visible: boolean;
  type?: ToastType;
  message: string;
  duration?: number;
  onHide: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const toastConfig = {
  success: {
    gradientColors: ['#10B981', '#059669'] as const,
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
  },
  error: {
    gradientColors: ['#EF4444', '#DC2626'] as const,
    icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
  },
  info: {
    gradientColors: ['#3B82F6', '#2563EB'] as const,
    icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
  },
  warning: {
    gradientColors: ['#F59E0B', '#D97706'] as const,
    icon: 'warning' as keyof typeof Ionicons.glyphMap,
  },
};

export default function ToastNotification({
  visible,
  type = 'info',
  message,
  duration = 2500,
  onHide,
  icon,
}: ToastNotificationProps) {
  const config = toastConfig[type];
  const displayIcon = icon || config.icon;
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide después del duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={hideToast}
    >
      <View 
        style={{ 
          flex: 1, 
          justifyContent: 'flex-start', 
          alignItems: 'center',
          paddingTop: 60,
          paddingHorizontal: 16,
        }}
        pointerEvents="box-none"
      >
        <Animated.View
          style={{
            transform: [{ translateY }],
            opacity,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <LinearGradient
            colors={config.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name={displayIcon} size={24} color="#fff" />
            <Text 
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '600',
                marginLeft: 12,
                flex: 1,
              }}
            >
              {message}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}
