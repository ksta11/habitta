import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md'
}: ButtonProps) {
  const getButtonStyles = () => {
    let baseStyles = 'rounded-lg items-center justify-center';
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyles += ' px-4 py-2';
        break;
      case 'lg':
        baseStyles += ' px-8 py-4';
        break;
      default:
        baseStyles += ' px-6 py-3';
    }

    // Variant styles
    if (disabled) {
      baseStyles += ' bg-gray-300';
    } else {
      switch (variant) {
        case 'secondary':
          baseStyles += ' bg-gray-500';
          break;
        case 'outline':
          baseStyles += ' bg-transparent border-2 border-blue-500';
          break;
        default:
          baseStyles += ' bg-blue-500';
      }
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    let textStyles = 'font-semibold';
    
    // Size styles
    switch (size) {
      case 'sm':
        textStyles += ' text-sm';
        break;
      case 'lg':
        textStyles += ' text-lg';
        break;
      default:
        textStyles += ' text-base';
    }

    // Color styles
    if (disabled) {
      textStyles += ' text-gray-500';
    } else if (variant === 'outline') {
      textStyles += ' text-blue-500';
    } else {
      textStyles += ' text-white';
    }

    return textStyles;
  };

  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text className={getTextStyles()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
