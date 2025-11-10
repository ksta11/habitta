import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { AdminProperty } from '../../interfaces/property/PropertyInterface';
import { usePropertiesManagement } from '../../modules/admin/hooks';
import { AdminStatsGrid } from './AdminStatsGrid';
import { FilterPanel, PropertyCard } from './Organisms';

export const PropertiesTable: React.FC = () => {
  const {
    properties,
    loading,
    error,
    searchTerm,
    filterType,
    filterStatus,
    filteredProperties,
    propertyStats,
    fetchProperties,
    clearFilters,
    cycleFilterType,
    cycleFilterStatus,
    setSearchTerm,
  } = usePropertiesManagement();

  const renderPropertyCard = ({ item: property }: { item: AdminProperty }) => (
    <PropertyCard
      property={property}
      onView={(prop) => console.log('View property:', prop.id)}
      onEdit={(prop) => console.log('Edit property:', prop.id)}
      onSuspend={(prop) => console.log('Suspend property:', prop.id)}
    />
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Gestión de Propiedades
          </Text>
          <Text className="text-gray-600">
            Administra todas las propiedades de la plataforma
          </Text>
        </View>

        {/* Stats Cards */}
        <AdminStatsGrid variant="custom" customStats={propertyStats} />

        {/* Filtros */}
        <FilterPanel
          title="Filtros"
          searchPlaceholder="Buscar por título, ciudad o propietario..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              label: filterType === 'todos' ? 'Tipo: Todos' : filterType,
              value: filterType,
              active: filterType !== 'todos',
              onPress: cycleFilterType,
            },
            {
              label: filterStatus === 'todos' ? 'Estado: Todos' : 
                     filterStatus === 'available' ? 'Disponible' :
                     filterStatus === 'occupied' ? 'Ocupada' :
                     filterStatus === 'maintenance' ? 'Mantenimiento' :
                     filterStatus === 'pending' ? 'Pendiente' : filterStatus,
              value: filterStatus,
              active: filterStatus !== 'todos',
              onPress: cycleFilterStatus,
            },
          ]}
          onClearFilters={clearFilters}
          showClearButton={filterType !== 'todos' || filterStatus !== 'todos' || searchTerm !== ''}
        />

        {/* Lista de propiedades */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Propiedades ({loading ? '...' : filteredProperties.length})
          </Text>
          
          {loading ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-500 mt-4">
                Cargando propiedades...
              </Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <FontAwesome name="exclamation-triangle" size={48} color="#ef4444" />
              <Text className="text-red-600 mt-4 text-center font-medium">
                {error}
              </Text>
              <Pressable
                onPress={fetchProperties}
                className="bg-red-100 px-4 py-2 rounded-lg mt-4"
              >
                <Text className="text-red-800 font-medium">Reintentar</Text>
              </Pressable>
            </View>
          ) : filteredProperties.length === 0 ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <FontAwesome name="home" size={48} color="#d1d5db" />
              <Text className="text-gray-500 mt-4">
                No se encontraron propiedades con los filtros aplicados
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProperties}
              renderItem={renderPropertyCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};