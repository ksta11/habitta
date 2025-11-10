import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  onSubmitEditing,
}) => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
      <FontAwesome name="search" size={16} color="#6b7280" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-3 text-gray-800"
        placeholderTextColor="#9ca3af"
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

