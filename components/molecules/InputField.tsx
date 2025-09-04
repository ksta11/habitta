import React from 'react';
import { View } from 'react-native';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  required?: boolean;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  required = false
}: InputFieldProps) {
  return (
    <View className="mb-2">
      {label && (
        <View className="mb-2">
          <Label 
            text={required ? `${label} *` : label} 
            size="sm" 
            weight="medium"
            variant={error ? 'error' : 'default'}
          />
        </View>
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        error={error}
        keyboardType={keyboardType}
      />
    </View>
  );
}
