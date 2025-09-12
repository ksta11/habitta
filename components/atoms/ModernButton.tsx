import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function ModernButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary'
}: ModernButtonProps) {
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
        fontWeight: '600' as const,
      };
    }

    return {
      color: disabled ? '#9CA3AF' : '#7C3AED',
      fontSize: 18,
      fontWeight: '600' as const,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}
