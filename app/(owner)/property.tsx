import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import PropertyCard from '../../components/atoms/PropertyCard';
import { getOwnerProperties } from '../../libs/owner/property/api-service';
import { Property } from '../../interfaces/PropertyInterface';

export default function PropertyScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProperties = async () => {
    try {
      console.log('🏠 Cargando propiedades...');
      const response = await getOwnerProperties();
      
      if (response.success) {
        setProperties(response.data);
        console.log(`✅ ${response.data.length} propiedades cargadas exitosamente`);
      } else {
        console.log('❌ Error al cargar propiedades:', response.message);
        Alert.alert('Error', response.message || 'No se pudieron cargar las propiedades');
      }
    } catch (error) {
      console.error('💥 Error crítico:', error);
      Alert.alert('Error', 'Error de conexión al cargar las propiedades');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Recargar propiedades cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Pantalla de propiedades enfocada, recargando datos...');
      loadProperties();
    }, [])
  );

  const formatPropertyData = (property: Property) => {
    // Función para formatear los datos de la propiedad para el card
    return {
      price: `$${property.price.toLocaleString()}`,
      address: `${property.title}, ${property.address}`,
      area: `${property.area} m²`,
      bathrooms: property.bathrooms.toString(),
      rooms: property.rooms.toString(),
      imageUrl: property.images && property.images.length > 0 
        ? property.images[0].url_image 
        : 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
    };
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Cargando propiedades...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Mis Propiedades</Text>
        <Text className="text-sm text-gray-500">{properties.length} propiedades</Text>
      </View>
      
      {properties.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-center mb-4">
            No tienes propiedades registradas
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Crea tu primera propiedad para comenzar
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
        >
          {properties.map((property) => {
            const formattedData = formatPropertyData(property);
            return (
              <View key={property.id} className="mb-4">
                <PropertyCard
                  price={formattedData.price}
                  address={formattedData.address}
                  area={formattedData.area}
                  bathrooms={formattedData.bathrooms}
                  rooms={formattedData.rooms}
                  imageUrl={formattedData.imageUrl}
                  onPress={() => {
                    console.log(`Propiedad ${property.id} seleccionada:`, property.title);
                    // Aquí puedes navegar a los detalles de la propiedad
                    // router.push(`/property/${property.id}`);
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      )}
      
      <TouchableOpacity
        className="mt-4 bg-blue-500 rounded-lg p-4"
        onPress={() => router.push('../(owner)/(properties)/create/Form')}
      >
        <Text className="text-white text-center font-bold">Crear nueva propiedad</Text>
      </TouchableOpacity>
    </View>
  );
}