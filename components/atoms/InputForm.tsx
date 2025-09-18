import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { FONTS } from '../../utils/fonts';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: 'modern' | 'classic';
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style = 'modern'
}: InputProps) {
  const getInputStyle = () => {
    if (style === 'modern') {
      return {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
        borderWidth: 0,
        fontFamily: FONTS.regular,
      };
    }
    
    return {
      borderWidth: 2,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      borderColor: error ? '#EF4444' : '#D1D5DB',
      backgroundColor: error ? '#FEF2F2' : '#FFFFFF',
      fontFamily: FONTS.regular,
    };
  };

  return (
    <View>
      <TextInput
        style={getInputStyle()}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#9CA3AF"
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-nunito">
          {error}
        </Text>
      )}
    </View>
  );
}
