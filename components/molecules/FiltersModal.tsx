import React from 'react';
import { View, Modal, ScrollView, Pressable, Text, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PropertyFilters {
  searchTerm: string;
  category: string;
  city: string;
  priceRange: {
    min: number;
    max: number;
  };
  rooms: number;
  bathrooms: number;
  areaRange: {
    min: number;
    max: number;
  };
}

interface FiltersModalProps {
  visible: boolean;
  filters: PropertyFilters;
  availableCities: string[];
  propertiesCount: number;
  onClose: () => void;
  onUpdateFilter: (key: keyof PropertyFilters, value: any) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export default function FiltersModal({
  visible,
  filters,
  availableCities,
  propertiesCount,
  onClose,
  onUpdateFilter,
  onResetFilters,
  onApplyFilters
}: FiltersModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header del Modal */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Filtros</Text>
          <Pressable onPress={onClose}>
            <FontAwesome name="times" size={24} color="#6b7280" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Filtro por Ciudad */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Ciudad</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable
                onPress={() => onUpdateFilter('city', 'todos')}
                className={`px-4 py-2 rounded-lg border mr-3 ${
                  filters.city === 'todos' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  filters.city === 'todos' ? 'text-blue-800' : 'text-gray-700'
                }`}>
                  Todas las ciudades
                </Text>
              </Pressable>
              {availableCities.map((city: string) => (
                <Pressable
                  key={city}
                  onPress={() => onUpdateFilter('city', city)}
                  className={`px-4 py-2 rounded-lg border mr-3 ${
                    filters.city === city ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    filters.city === city ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {city}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Filtro por Precio */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Rango de Precio ($${filters.priceRange.min.toLocaleString()} - $${filters.priceRange.max.toLocaleString()})
            </Text>
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Precio mínimo</Text>
                <TextInput
                  value={filters.priceRange.min.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    onUpdateFilter('priceRange', { ...filters.priceRange, min: value });
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Precio máximo</Text>
                <TextInput
                  value={filters.priceRange.max.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 5000000;
                    onUpdateFilter('priceRange', { ...filters.priceRange, max: value });
                  }}
                  keyboardType="numeric"
                  placeholder="5000000"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </View>
            </View>
            
            {/* Rangos de precio predefinidos */}
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: "Hasta $500K", max: 500000 },
                { label: "$500K - $1M", min: 500000, max: 1000000 },
                { label: "$1M - $2M", min: 1000000, max: 2000000 },
                { label: "$2M - $5M", min: 2000000, max: 5000000 },
              ].map((range, index) => (
                <Pressable
                  key={index}
                  onPress={() => onUpdateFilter('priceRange', { 
                    min: range.min || 0, 
                    max: range.max 
                  })}
                  className="bg-gray-100 px-3 py-1 rounded-lg"
                >
                  <Text className="text-gray-700 text-xs">{range.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Filtro por Habitaciones */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Habitaciones mínimas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5].map((rooms) => (
                <Pressable
                  key={rooms}
                  onPress={() => onUpdateFilter('rooms', rooms)}
                  className={`px-4 py-2 rounded-lg border mr-3 ${
                    filters.rooms === rooms ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    filters.rooms === rooms ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {rooms === 0 ? 'Cualquiera' : `${rooms}+ hab`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Filtro por Baños */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Baños mínimos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4].map((bathrooms) => (
                <Pressable
                  key={bathrooms}
                  onPress={() => onUpdateFilter('bathrooms', bathrooms)}
                  className={`px-4 py-2 rounded-lg border mr-3 ${
                    filters.bathrooms === bathrooms ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    filters.bathrooms === bathrooms ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    {bathrooms === 0 ? 'Cualquiera' : `${bathrooms}+ baños`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Filtro por Área */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Área (m²) ({filters.areaRange.min} - {filters.areaRange.max})
            </Text>
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Área mínima</Text>
                <TextInput
                  value={filters.areaRange.min.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    onUpdateFilter('areaRange', { ...filters.areaRange, min: value });
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Área máxima</Text>
                <TextInput
                  value={filters.areaRange.max.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 500;
                    onUpdateFilter('areaRange', { ...filters.areaRange, max: value });
                  }}
                  keyboardType="numeric"
                  placeholder="500"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer del Modal */}
        <View className="border-t border-gray-200 px-6 py-4">
          <View className="flex-row gap-3">
            <Pressable
              onPress={onResetFilters}
              className="flex-1 bg-gray-100 py-3 rounded-lg items-center"
            >
              <Text className="text-gray-800 font-medium">Limpiar filtros</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-1 bg-violet py-3 rounded-lg items-center"
            >
              <Text className="text-white font-medium">
                Aplicar ({propertiesCount})
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}