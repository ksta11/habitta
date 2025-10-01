import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Image, Text, Alert, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../../components/atoms/Button';
import { getPropertyById } from '../../../libs/owner/property/api-service';
import { Property } from '../../../interfaces/property/PropertyInterface';

const ArrowLeftIcon = () => <Text>←</Text>;
const HeartIcon = ({ filled }: { filled: boolean }) => <Text>{filled ? '❤️' : '🤍'}</Text>;
const LocationIcon = () => <Text>📍</Text>;
const PhoneIcon = () => <Text>📞</Text>;
const MessageIcon = () => <Text>💬</Text>;
const WifiIcon = () => <Text>📶</Text>;
const CarIcon = () => <Text>🚗</Text>;
const GymIcon = () => <Text>🏋️</Text>;
const CoffeeIcon = () => <Text>☕</Text>;
const ShieldIcon = () => <Text>🛡️</Text>;


// Servicios que podrían tener las propiedades (puedes personalizar según tus necesidades)
const defaultAmenities = [
  { icon: WifiIcon, name: "WiFi gratuito" },
  { icon: CarIcon, name: "Estacionamiento" },
  { icon: GymIcon, name: "Gimnasio" },
  { icon: CoffeeIcon, name: "Cocina equipada" },
  { icon: ShieldIcon, name: "Seguridad 24/7" },
];

const { width: screenWidth } = Dimensions.get('window');

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  console.log('PropertyDetails - ID recibido:', id);

  // Función para cargar los detalles de la propiedad
  const loadPropertyDetails = async () => {
    if (!id || typeof id !== 'string') {
      console.log('❌ ID inválido:', id);
      setLoading(false);
      return;
    }

    try {
      console.log('🏠 Cargando detalles de la propiedad:', id);
      const response = await getPropertyById(id);

      if (response.success && response.data) {
        setProperty(response.data);
        console.log('✅ Propiedad cargada exitosamente:', response.data.title);
      } else {
        console.log('❌ Error al cargar propiedad:', response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudo cargar la propiedad"
        );
      }
    } catch (error) {
      console.error('💥 Error crítico:', error);
      Alert.alert("Error", "Error de conexión al cargar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  // Función helper para formatear el precio
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-MX')}`;
  };

  // Función helper para obtener las imágenes de la propiedad
  const getPropertyImages = (property: Property): string[] => {
    if (property.images && property.images.length > 0) {
      return property.images.map(img => img.url_image);
    }
    return ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop']; // imagen por defecto
  };

  // Función helper para capitalizar texto
  const capitalizeText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Función helper para obtener amenidades basadas en los servicios
  const getAmenities = (services: string) => {
    // Por ahora retornamos las amenidades por defecto
    // Podrías parsear el string 'services' si tiene un formato específico
    return defaultAmenities;
  };

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Cargando propiedad...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg font-bold text-gray-800 mb-2">Propiedad no encontrada</Text>
        <Text className="text-sm text-gray-600 mb-4">ID: {id}</Text>
        <Pressable 
          className="mt-4 bg-blue-600 px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">

      {/* Header with Back Button */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row items-center justify-between px-6 py-4">
        <Pressable
          className="bg-white/80 backdrop-blur-sm rounded-full p-3"
          onPress={goBack}
        >
          <ArrowLeftIcon />
        </Pressable>
        <View className="flex-row gap-2">
          <Pressable 
            className="bg-white/80 backdrop-blur-sm rounded-full p-3"
            onPress={toggleFavorite}
          >
            <HeartIcon filled={isFavorite} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View className="relative">
          <FlatList
            ref={flatListRef}
            data={getPropertyImages(property)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item: imageUrl }) => (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: screenWidth, height: 320 }}
                resizeMode="cover"
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* Image Indicators */}
          {getPropertyImages(property).length > 1 && (
            <View className="absolute bottom-4 left-1/2 flex-row gap-2" style={{ transform: [{ translateX: -((getPropertyImages(property).length * 12) / 2) }] }}>
              {getPropertyImages(property).map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setCurrentImageIndex(index);
                    flatListRef.current?.scrollToIndex({ 
                      index, 
                      animated: true 
                    });
                  }}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-6 py-6 pb-32">
          {/* Title and Info */}
          <View className="mb-4">
            <View className="mb-2">
              <Text className="text-xl font-bold text-gray-900">{property.title}</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold text-gray-900 capitalize">
                  {capitalizeText(property.type)}
                </Text>
                <Text className="text-sm text-gray-400">•</Text>
                <Text className="text-sm text-gray-600">
                  {property.rooms} hab • {property.bathrooms} baños • {property.area} m²
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-sm text-gray-600">{property.address}, {property.city}</Text>
            </View>
          </View>

          {/* Price */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</Text>
                <Text className="text-sm text-gray-600">/mes</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                property.publication_status === 'published' 
                  ? 'bg-green-100' 
                  : property.publication_status === 'rented' 
                    ? 'bg-red-100' 
                    : 'bg-gray-100'
              }`}>
                <Text className={`text-sm font-medium ${
                  property.publication_status === 'published' 
                    ? 'text-green-800' 
                    : property.publication_status === 'rented' 
                      ? 'text-red-800' 
                      : 'text-gray-800'
                }`}>
                  {property.publication_status === 'published' 
                    ? 'Disponible ahora' 
                    : property.publication_status === 'rented' 
                      ? 'Rentado' 
                      : 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Descripción</Text>
            </View>
            <Text className="text-sm text-gray-600">{property.description}</Text>
          </View>

          {/* Services & Amenities */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Servicios</Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 mb-3">
              <Text className="text-sm text-gray-700">{property.services}</Text>
            </View>
            <View className="flex-row flex-wrap">
              {getAmenities(property.services).map((amenity, index) => (
                <View key={index} className="flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3 w-[48%] mr-2">
                  <amenity.icon />
                  <Text className="text-sm font-medium text-gray-900">{amenity.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Ubicación</Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <LocationIcon />
                <Text className="text-sm font-medium text-gray-900">{property.address}, {property.city}</Text>
              </View>
              <Text className="text-sm text-gray-600">
                Excelente ubicación con acceso a restaurantes, cafeterías, centros comerciales y transporte público.
              </Text>
            </View>
          </View>

          {/* Property Info */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Información de la propiedad</Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Fecha de publicación:</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {new Date(property.publication_date).toLocaleDateString('es-ES')}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Estado:</Text>
                <Text className="text-sm font-medium text-gray-900 capitalize">
                  {property.publication_status === 'published' ? 'Publicado' : 
                   property.publication_status === 'rented' ? 'Rentado' : 'No disponible'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Área total:</Text>
                <Text className="text-sm font-medium text-gray-900">{property.area} m²</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <View className="flex-row gap-3">
          <Pressable className="border border-gray-300 rounded-full p-3">
            <PhoneIcon />
          </Pressable>
          <Pressable className="border border-gray-300 rounded-full p-3">
            <MessageIcon />
          </Pressable>
          <View className="flex-1">
            <Button
              title="Contactar anfitrión"
              onPress={() => console.log('Contactar anfitrión')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}