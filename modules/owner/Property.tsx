import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ButtonAtom from '../../components/atoms/ButtonAtom';
import OptionModal from '../../components/atoms/OptionModal';
import { standarDangerButton, standarPrimaryButton, standarSecondaryButton } from '../../utils/TokensDesing';
import PropertyCard from './Atoms/PropertyCard';
import { useOwnerProperties } from './hooks/useOwnerProperties';

export default function PropertyScreen() {
  const router = useRouter();

  // === HOOK DE PROPIEDADES DEL PROPIETARIO ===
  const {
    properties,
    loading,
    refreshing,
    checkingStatus,
    showOptionModal,
    setShowOptionModal,
    handleRefresh,
    showDeleteConfirmation,
    handleCreatePropertyPress,
    formatPropertyData,
    handleEditProperty,
    handleViewProperty,
  } = useOwnerProperties();

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
                  onPress={() => handleViewProperty(item.id, item.title)}
                />

                {/* Botones de editar y eliminar */}
                <View className="mt-2 flex-row">
                  <View className="flex-1 mr-2">
                    <ButtonAtom
                      title="Editar"
                      onPress={() => handleEditProperty(item.id, item.title, item.publication_status)}
                      variant="habitta-secondary"
                      size="medium"
                      icon="create-outline"
                      iconPosition="left"
                      fullWidth={true}
                      className={standarSecondaryButton}
                    />
                  </View>
                  
                  <View className="flex-1">
                    <ButtonAtom
                      title="Eliminar"
                      onPress={() => showDeleteConfirmation(item.id, item.title, item.publication_status)}
                      variant="danger"
                      size="medium"
                      icon="trash-outline"
                      iconPosition="left"
                      fullWidth={true}
                      className={standarDangerButton}
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
          className={standarPrimaryButton}
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
