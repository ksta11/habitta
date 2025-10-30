 import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  // Límites de caracteres
  minLength?: number;
  maxLength?: number;
  // Color props
  borderColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  textColor?: string;
  errorColor?: string;
  placeholderColor?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  // Límites de caracteres
  minLength,
  maxLength,
  // Color defaults
  borderColor = '#D1D5DB', // gray-300
  backgroundColor = '#FFFFFF', // white
  labelColor = '#6B7280', // gray-500
  textColor = '#1F2937', // gray-800
  errorColor = '#EF4444', // red-500
  placeholderColor = '#9CA3AF' // gray-400
}: InputProps) {
  /**
   * Maneja el cambio de texto validando los límites
   */
  const handleTextChange = (text: string) => {
    if (maxLength && text.length > maxLength) {
      return; // No permite ingresar más caracteres
    }
    
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const getBorderStyle = () => {
    if (error) {
      return {
        borderColor: errorColor,
        borderWidth: 2,
        backgroundColor: `${errorColor}10` // 10% opacity
      };
    }
    return {
      borderColor: borderColor,
      borderWidth: 2,
      backgroundColor: backgroundColor
    };
  };

  return (
    <View className="mb-4">
      {label && (
        <Text 
          className="absolute left-4 top-4 bg-white px-1 text-xs z-10 rounded-sm" 
          style={{
            transform: [{translateY: -10}],
            color: labelColor,
            backgroundColor: backgroundColor
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        className="rounded-3xl px-4 py-3 text-base mt-3"
        style={{
          ...getBorderStyle(),
          color: textColor
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderColor}
        maxLength={maxLength}
      />
      {error && (
        <Text 
          className="text-sm mt-1 ml-1"
          style={{ color: errorColor }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}