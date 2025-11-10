import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { AdminProperty } from '../../../interfaces/property/PropertyInterface';
import { StatusBadge, TypeBadge } from '../Atoms';

interface PropertyCardProps {
  property: AdminProperty;
  onView?: (property: AdminProperty) => void;
  onEdit?: (property: AdminProperty) => void;
  onSuspend?: (property: AdminProperty) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onView,
  onEdit,
  onSuspend,
}) => {
  return (
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
              <StatusBadge status={property.status} variant="property" />
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
        {onView && (
          <Pressable 
            onPress={() => onView(property)} 
            className="bg-blue-100 px-3 py-2 rounded-lg flex-row items-center mr-2"
          >
            <FontAwesome name="eye" size={12} color="#3b82f6" />
            <Text className="text-blue-600 text-xs font-medium ml-1">Ver</Text>
          </Pressable>
        )}
        {onEdit && (
          <Pressable 
            onPress={() => onEdit(property)} 
            className="bg-green-100 px-3 py-2 rounded-lg flex-row items-center mr-2"
          >
            <FontAwesome name="edit" size={12} color="#10b981" />
            <Text className="text-green-600 text-xs font-medium ml-1">Editar</Text>
          </Pressable>
        )}
        {onSuspend && (
          <Pressable 
            onPress={() => onSuspend(property)} 
            className="bg-red-100 px-3 py-2 rounded-lg flex-row items-center"
          >
            <FontAwesome name="ban" size={12} color="#ef4444" />
            <Text className="text-red-600 text-xs font-medium ml-1">Suspender</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

