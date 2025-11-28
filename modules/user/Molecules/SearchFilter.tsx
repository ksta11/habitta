import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { standarFilterButton, standarFilterButtonPressed } from '../../../utils/TokensDesing';
import { secureSearchField, MAX_LENGTHS } from '../../../utils/validation';
import { z } from 'zod';

// 🔒 Schema de validación para búsqueda
const searchSchema = z.object({
  search: secureSearchField(MAX_LENGTHS.SEARCH)
});

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
  const [error, setError] = useState<string | null>(null);

  /**
   * Maneja el cambio de texto con validación Zod
   */
  const handleSearchChange = (text: string) => {
    console.log('🔍 [SearchFilter] Input recibido:', text);
    
    // Validar con Zod
    const result = searchSchema.safeParse({ search: text });

    if (!result.success) {
      // Mostrar el primer error de validación
      const firstError = result.error.errors[0];
      console.log('❌ [SearchFilter] Validación falló:', firstError.message);
      setError(firstError.message);
      return;
    }

    // Si pasa la validación, limpiar error y usar valor sanitizado
    console.log('✅ [SearchFilter] Validación exitosa, valor:', result.data.search);
    setError(null);
    onSearchChange(result.data.search);
  };

  return (
    <View className="px-6 mb-6">
      <View className="flex-row gap-3">
        <View className="flex-1 relative">
          <View className={`flex-row items-center bg-gray-100 rounded-lg px-4 py-3 ${error ? 'border-2 border-red-500' : ''}`}>
            <FontAwesome name="search" size={16} color="#6b7280" />
            <TextInput
              placeholder="¿Dónde quieres buscar?"
              value={searchTerm}
              onChangeText={handleSearchChange}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9ca3af"
              onSubmitEditing={onSubmit}
              maxLength={MAX_LENGTHS.SEARCH}
            />
          </View>
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
          )}
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