import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SearchBar } from '../Molecules';

interface FilterPanelProps {
  title?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (text: string) => void;
  filters?: Array<{
    label: string;
    value: string;
    active: boolean;
    onPress: () => void;
  }>;
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  title = 'Filtros',
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  showClearButton = false,
}) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      {title && (
        <Text className="text-lg font-semibold text-gray-800 mb-4">{title}</Text>
      )}
      
      {/* Búsqueda */}
      <View className="mb-4">
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Filtros */}
      {filters.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
          {filters.map((filter) => (
            <Pressable
              key={filter.value}
              onPress={filter.onPress}
              className={`px-3 py-1 rounded-full ${
                filter.active
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium ${
                filter.active ? 'text-blue-800' : 'text-gray-700'
              }`}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Botón para limpiar filtros */}
      {showClearButton && onClearFilters && (
        <Pressable 
          onPress={onClearFilters}
          className="bg-red-100 px-4 py-2 rounded-lg border border-red-300 items-center"
        >
          <Text className="text-red-800 text-sm font-medium">
            Limpiar Filtros
          </Text>
        </Pressable>
      )}
    </View>
  );
};

