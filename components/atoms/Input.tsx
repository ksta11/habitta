 import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default'
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="absolute left-4 top-4 bg-white px-1 text-xs text-gray-500 z-10" style={{transform: [{translateY: -10}]}}>
          {label}
        </Text>
      )}
      <TextInput
        className={`border-2 rounded-3xl px-4 py-3 text-base mt-3 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#9CA3AF"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}