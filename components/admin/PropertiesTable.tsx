import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { AdminProperty } from '../../interfaces/property/PropertyInterface';
import { usePropertiesManagement } from '../../modules/admin/hooks';
import { AdminStatsGrid } from './AdminStatsGrid';

// Componente Badge para estado
interface BadgeProps {
  status: AdminProperty['status'];
}

const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const getStatusConfig = (status: AdminProperty['status']) => {
    switch (status) {
      case 'available':
        return { text: 'Disponible', className: 'bg-green-100 text-green-800' };
      case 'occupied':
        return { text: 'Ocupada', className: 'bg-blue-100 text-blue-800' };
      case 'maintenance':
        return { text: 'Mantenimiento', className: 'bg-yellow-100 text-yellow-800' };
      case 'pending':
        return { text: 'Pendiente', className: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <View className={`px-2 py-1 rounded-full ${config.className}`}>
      <Text className={`text-xs font-medium ${config.className.split(' ')[1]}`}>
        {config.text}
      </Text>
    </View>
  );
};

// Componente Badge para tipo de propiedad
interface TypeBadgeProps {
  type: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartamento':
        return 'building';
      case 'casa':
        return 'home';
      case 'estudio':
        return 'bed';
      case 'ático':
        return 'star';
      case 'loft':
        return 'industry';
      default:
        return 'building';
    }
  };

  return (
    <View className="flex-row items-center bg-purple-100 px-2 py-1 rounded-full">
      <FontAwesome name={getTypeIcon(type)} size={10} color="#7c3aed" />
      <Text className="text-purple-800 text-xs font-medium ml-1">{type}</Text>
    </View>
  );
};

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
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      {/* Header de la propiedad */}
      <View className="flex-row items-start mb-3">
        <View className="mr-4">
          {property.images && property.images.length > 0 && property.images[0]?.url_image ? (
            <Image 
              source={{ uri: property.images[0].url_image }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-lg bg-gray-200 items-center justify-center">
              <FontAwesome name="home" size={24} color="#9ca3af" />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {property.title || 'Sin título'}
          </Text>
          <View className="flex-row items-center mb-2">
            <FontAwesome name="map-marker" size={12} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.city || 'Sin ciudad'} • {property.address || 'Sin dirección'}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <TypeBadge type={property.type} />
            <View className="ml-2">
              <StatusBadge status={property.status} />
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-gray-800">
            €{(property.price || 0).toLocaleString()}
          </Text>
          <Text className="text-gray-500 text-sm">por mes</Text>
        </View>
      </View>

      {/* Información del propietario */}
      <View className="flex-row items-center mb-3 bg-gray-50 p-3 rounded-lg">
        <View className="flex-1">
          {/* <View className="flex-row items-center mb-1">
            <FontAwesome name="user" size={12} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.owner_name || 'Desconocido'}
            </Text>
          </View> */}
          <View className="flex-row items-center">
            <FontAwesome name="home" size={12} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {property.rooms || 0} hab • {property.bathrooms || 0} baños • {property.area || 0}m²
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <View className="items-center mr-4">
            <View className="flex-row items-center">
              <FontAwesome name="eye" size={12} color="#6b7280" />
              <Text className="text-gray-600 text-xs ml-1">{property.views || 0}</Text>
            </View>
            <Text className="text-gray-500 text-xs">vistas</Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <FontAwesome name="heart" size={12} color="#6b7280" />
              <Text className="text-gray-600 text-xs ml-1">{property.favorites || 0}</Text>
            </View>
            <Text className="text-gray-500 text-xs">favoritos</Text>
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View className="flex-row justify-end">
        <Pressable className="bg-blue-100 px-3 py-2 rounded-lg flex-row items-center mr-2">
          <FontAwesome name="eye" size={12} color="#3b82f6" />
          <Text className="text-blue-600 text-xs font-medium ml-1">Ver</Text>
        </Pressable>
        <Pressable className="bg-green-100 px-3 py-2 rounded-lg flex-row items-center mr-2">
          <FontAwesome name="edit" size={12} color="#10b981" />
          <Text className="text-green-600 text-xs font-medium ml-1">Editar</Text>
        </Pressable>
        <Pressable className="bg-red-100 px-3 py-2 rounded-lg flex-row items-center">
          <FontAwesome name="ban" size={12} color="#ef4444" />
          <Text className="text-red-600 text-xs font-medium ml-1">Suspender</Text>
        </Pressable>
      </View>
    </View>
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
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Filtros</Text>
          
          {/* Búsqueda */}
          <View className="mb-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <FontAwesome name="search" size={16} color="#6b7280" />
              <TextInput
                placeholder="Buscar por título, ciudad o propietario..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-3 text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Filtros por tipo y estado */}
          <View className="flex-row justify-between">
            <Pressable 
              onPress={cycleFilterType}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                filterType === 'Apartamento' ? 'bg-blue-100 border-blue-300' : 
                filterType === 'Casa' ? 'bg-green-100 border-green-300' :
                filterType === 'Estudio' ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                filterType === 'Apartamento' ? 'text-blue-800' : 
                filterType === 'Casa' ? 'text-green-800' :
                filterType === 'Estudio' ? 'text-purple-800' : 'text-gray-700'
              }`}>
                {filterType === 'todos' ? 'Tipo: Todos' : filterType}
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={cycleFilterStatus}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                filterStatus === 'available' ? 'bg-green-100 border-green-300' : 
                filterStatus === 'occupied' ? 'bg-blue-100 border-blue-300' :
                filterStatus === 'maintenance' ? 'bg-yellow-100 border-yellow-300' :
                filterStatus === 'pending' ? 'bg-gray-100 border-gray-300' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                filterStatus === 'available' ? 'text-green-800' : 
                filterStatus === 'occupied' ? 'text-blue-800' :
                filterStatus === 'maintenance' ? 'text-yellow-800' :
                filterStatus === 'pending' ? 'text-gray-800' : 'text-gray-700'
              }`}>
                {filterStatus === 'todos' ? 'Estado: Todos' : 
                 filterStatus === 'available' ? 'Disponible' :
                 filterStatus === 'occupied' ? 'Ocupada' :
                 filterStatus === 'maintenance' ? 'Mantenimiento' :
                 filterStatus === 'pending' ? 'Pendiente' : filterStatus}
              </Text>
            </Pressable>
          </View>

          {/* Botón para limpiar filtros */}
          {(filterType !== 'todos' || filterStatus !== 'todos' || searchTerm !== '') && (
            <Pressable 
              onPress={clearFilters}
              className="mt-3 bg-red-100 px-4 py-2 rounded-lg border border-red-300 items-center"
            >
              <Text className="text-red-800 text-sm font-medium">
                Limpiar Filtros
              </Text>
            </Pressable>
          )}
        </View>

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