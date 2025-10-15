import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import ButtonAtom from '../../components/atoms/ButtonAtom';
import OptionModal from '../../components/atoms/OptionModal';
import { Property } from '../../interfaces/property/PropertyInterface';
import { getOwnerStatus } from '../../libs/owner/api-service';
import { deleteProperty, getOwnerProperties } from '../../libs/owner/property/api-service';
import PropertyCard from './Atoms/PropertyCard';

export default function PropertyScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

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

  const handleDeleteProperty = async (propertyId: string, propertyTitle: string) => {
    try {
      console.log('🗑️ Iniciando eliminación de propiedad:', propertyId);
      
      const response = await deleteProperty(propertyId);
      
      if (response.success) {
        console.log('✅ Propiedad eliminada exitosamente');
        Alert.alert(
          'Éxito',
          response.message || 'La propiedad ha sido eliminada correctamente',
          [
            {
              text: 'OK',
              onPress: () => loadProperties() // Recargar la lista
            }
          ]
        );
      } else {
        console.log('❌ Error al eliminar:', response.message);
        Alert.alert('Error', response.message || 'No se pudo eliminar la propiedad');
      }
    } catch (error) {
      console.error('💥 Error crítico al eliminar:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la propiedad');
    }
  };

  const showDeleteConfirmation = (propertyId: string, propertyTitle: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar la propiedad "${propertyTitle}"?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteProperty(propertyId, propertyTitle)
        }
      ]
    );
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

  // Handler extraído para la acción de crear nueva propiedad
  const handleCreatePropertyPress = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const statusResp = await getOwnerStatus();
      if (statusResp.success && statusResp.data) {
        if (statusResp.data.status === 'Verified') {
          router.push('./create/Form');
        } else {
          // Solo mostrar el OptionModal cuando la consulta haya sido exitosa
          setShowOptionModal(true);
        }
      } else {
        // Respuesta no exitosa: mostrar alerta con el mensaje
        Alert.alert('Error', statusResp.message || 'No se pudo obtener el estado del propietario');
      }
    } catch (err) {
      console.error('Error al consultar status del propietario:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Error al consultar el estado del propietario');
    } finally {
      setCheckingStatus(false);
    }
  }, [router]);

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
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const formattedData = formatPropertyData(item);
            return (
              <View key={item.id} className="mb-4">
                <PropertyCard
                  price={formattedData.price}
                  address={formattedData.address}
                  area={formattedData.area}
                  bathrooms={formattedData.bathrooms}
                  rooms={formattedData.rooms}
                  imageUrl={formattedData.imageUrl}
                  onPress={() => {
                    console.log(`Propiedad ${item.id} seleccionada:`, item.title);
                    // Aquí puedes navegar a los detalles de la propiedad
                    // router.push(`/property/${item.id}`);
                  }}
                />

                {/* Botones de editar y eliminar */}
                <View className="mt-2 flex-row">
                  <View className="flex-1 mr-2">
                    <ButtonAtom
                      title="Editar"
                      onPress={() => {
                        console.log(`Editando propiedad ${item.id}:`, item.title);
                        router.push(`./edit/${item.id}`);
                      }}
                      variant="habitta-secondary"
                      size="medium"
                      icon="create-outline"
                      iconPosition="left"
                      fullWidth={true}
                    />
                  </View>
                  
                  <View className="flex-1">
                    <ButtonAtom
                      title="Eliminar"
                      onPress={() => showDeleteConfirmation(item.id, item.title)}
                      variant="danger"
                      size="medium"
                      icon="trash-outline"
                      iconPosition="left"
                      fullWidth={true}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
      
      <View className="mt-4">
        <ButtonAtom
          title="Crear nueva propiedad"
          onPress={handleCreatePropertyPress}
          loading={checkingStatus}
          variant="habitta-primary"
          size="large"
          icon="add-circle-outline"
          iconPosition="left"
          fullWidth={true}
        />
        
        <OptionModal
          visible={showOptionModal}
          title="Verificar identidad"
          message="Tu cuenta no está verificada. Para crear una propiedad debes verificar tu identidad. ¿Deseas comenzar el proceso ahora?"
          onCancel={() => setShowOptionModal(false)}
          onConfirm={() => {
            setShowOptionModal(false);
            // Ajusta la ruta si tu pantalla de verificación tiene otro path
            router.push('../(settings)/upload/verifyIdentity');
          }}
          cancelText="Más tarde"
          confirmText="Verificar identidad"
        />
      </View>
    </View>
  );
}
