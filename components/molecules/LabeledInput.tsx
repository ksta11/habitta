import React from 'react';
import { View, Text } from 'react-native';
import Input from '../atoms/InputForm';

interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength
}: LabeledInputProps) {
  return (
    <View className="mb-3">
      <Text className="text-gray-600 text-sm mb-2 ml-1 font-nunito-medium">{label}</Text>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        error={error}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        style="modern"
      />
    </View>
  );
}
