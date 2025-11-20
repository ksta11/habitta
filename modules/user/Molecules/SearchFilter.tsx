import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { standarFilterButton, standarFilterButtonPressed } from '../../../utils/TokensDesing';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onSubmit: () => void;
  onShowFilters: () => void;
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  onSubmit,
  onShowFilters
}: SearchFilterProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View className="px-6 mb-6">
      <View className="flex-row gap-3">
        <View className="flex-1 relative">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <FontAwesome name="search" size={16} color="#6b7280" />
            <TextInput
              placeholder="¿Dónde quieres buscar?"
              value={searchTerm}
              onChangeText={onSearchChange}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9ca3af"
              onSubmitEditing={onSubmit}
            />
          </View>
        </View>
        <Pressable 
          onPress={onShowFilters}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          className={`px-4 py-3 ${isPressed ? standarFilterButtonPressed : standarFilterButton}`}
        >
          <FontAwesome name="filter" size={16} color="white" />
          <Text className="text-white ml-2 font-medium">Filtros</Text>
        </Pressable>
      </View>
    </View>
  );
}