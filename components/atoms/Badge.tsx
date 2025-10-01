import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles = {
  default: 'bg-lavender-indigo',
  secondary: 'bg-gray-100',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
  info: 'bg-blue-100',
};

const textVariantStyles = {
  default: 'text-white-traffic',
  secondary: 'text-gray-700',
  success: 'text-green-700',
  warning: 'text-yellow-700',
  error: 'text-red-700',
  info: 'text-blue-700',
};

export function Badge({ 
  children, 
  variant = 'default', 
  className = '', 
  style,
  textStyle 
}: BadgeProps) {
  return (
    <View 
      className={`px-2 py-1 rounded-full flex-row items-center ${variantStyles[variant]} ${className}`}
      style={style}
    >
      <Text 
        className={`text-xs font-medium ${textVariantStyles[variant]}`}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}