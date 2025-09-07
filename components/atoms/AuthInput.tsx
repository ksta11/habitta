import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';

interface AuthInputProps extends TextInputProps {
  error?: string;
  variant?: 'modern' | 'classic';
}

export default function AuthInput({
  error,
  variant = 'modern',
  style,
  ...props
}: AuthInputProps) {
  const getInputStyle = () => {
    const baseStyle = {
      fontSize: 16,
      color: '#1F2937',
    };

    if (variant === 'modern') {
      return {
        ...baseStyle,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 0,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: error ? '#EF4444' : '#D1D5DB',
    };
  };

  return (
    <View>
      <TextInput
        style={[getInputStyle(), style]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}
