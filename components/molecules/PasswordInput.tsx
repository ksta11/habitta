import React from 'react';
import { View, Text } from 'react-native';
import Input from '../atoms/InputForm';
import IconButton from '../atoms/IconButton';

interface PasswordInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  showPassword,
  onTogglePassword
}: PasswordInputProps) {
  return (
    <View className="mb-3">
      <Text className="text-gray-600 text-sm mb-2 ml-1">{label}</Text>
      <View className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          error={error}
          style="modern"
        />
        <View className="absolute right-4" style={{ top: 14 }}>
          <IconButton
            iconName={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#9CA3AF"
            onPress={onTogglePassword}
          />
        </View>
      </View>
    </View>
  );
}
