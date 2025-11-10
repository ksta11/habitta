import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FONTS } from '../../utils/fonts';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  enableHaptics?: boolean; // Nueva prop para habilitar/deshabilitar haptics
  hapticStyle?: 'light' | 'medium' | 'heavy'; // Tipo de haptic feedback
}

export default function ModernButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  enableHaptics = true,
  hapticStyle = 'medium'
}: ModernButtonProps) {
  
  // Función para manejar el press con haptics
  const handlePress = async () => {
    if (disabled || loading) return;
    
    // Ejecutar haptic feedback antes de la acción
    if (enableHaptics) {
      try {
        switch (hapticStyle) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        }
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    // Ejecutar la acción del botón
    onPress();
  };
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    };

    if (variant === 'primary') {
      return {
        ...baseStyle,
        backgroundColor: disabled ? '#9CA3AF' : '#7C3AED',
        shadowColor: '#7C3AED',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
      borderWidth: 1,
      borderColor: disabled ? '#D1D5DB' : '#7C3AED',
      shadowColor: '#000000',
    };
  };

  const getTextStyle = () => {
    if (variant === 'primary') {
      return {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FONTS.semibold,
      };
    }

    return {
      color: disabled ? '#9CA3AF' : '#7C3AED',
      fontSize: 18,
      fontFamily: FONTS.semibold,
    };
  };

  // Función para manejar el feedback visual al presionar
  const handlePressIn = () => {
    if (enableHaptics && !disabled && !loading) {
      // Haptic muy sutil al tocar (opcional)
      Haptics.selectionAsync().catch(() => {});
    }
  };

  return (
    <Pressable
      style={getButtonStyle()}
      onPress={handlePress}
      onPressIn={handlePressIn}
      disabled={disabled || loading}
    >
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
    </Pressable>
  );
}

