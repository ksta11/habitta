import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../../components/atoms/Button';

const ArrowLeftIcon = () => <Text>←</Text>;
const HeartIcon = ({ filled }: { filled: boolean }) => <Text>{filled ? '❤️' : '🤍'}</Text>;
const ShareIcon = () => <Text>📤</Text>;
const StarIcon = () => <Text>⭐</Text>;
const LocationIcon = () => <Text>📍</Text>;
const PhoneIcon = () => <Text>📞</Text>;
const MessageIcon = () => <Text>💬</Text>;
const WifiIcon = () => <Text>📶</Text>;
const CarIcon = () => <Text>🚗</Text>;
const GymIcon = () => <Text>🏋️</Text>;
const CoffeeIcon = () => <Text>☕</Text>;
const ShieldIcon = () => <Text>🛡️</Text>;


// Datos de propiedades (en una app real, esto vendría de una API)
const properties = [
  {
    id: 1,
    title: "Apartamento moderno en Polanco",
    location: "Polanco, CDMX",
    price: "$25,000",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    description: "Hermoso apartamento completamente amueblado y equipado, ideal para profesionales que buscan comodidad y estilo. Ubicado en una de las mejores zonas de la ciudad, con fácil acceso a transporte público y servicios.",
    host: {
      name: "Juan Martínez",
      rating: 4.9,
      since: "2020"
    }
  },
  {
    id: 2,
    title: "Casa con jardín en Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$35,000",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    description: "Hermosa casa con jardín privado, perfecta para familias o profesionales que valoran el espacio y la tranquilidad en el corazón de Roma Norte.",
    host: {
      name: "María González",
      rating: 4.8,
      since: "2019"
    }
  },
  {
    id: 3,
    title: "Oficina ejecutiva en Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$45,000",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    description: "Oficina ejecutiva completamente equipada en el distrito financiero de Santa Fe. Ideal para empresas que buscan ubicación premium.",
    host: {
      name: "Carlos Ruiz",
      rating: 4.7,
      since: "2021"
    }
  },
  {
    id: 4,
    title: "Co-living en Condesa",
    location: "Condesa, CDMX",
    price: "$18,000",
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    description: "Espacio de co-living moderno en la vibrante Condesa. Perfecto para jóvenes profesionales que buscan comunidad y networking.",
    host: {
      name: "Ana Sánchez",
      rating: 4.6,
      since: "2022"
    }
  },
  {
    id: 5,
    title: "Loft industrial en Doctores",
    location: "Doctores, CDMX",
    price: "$22,000",
    rating: 4.5,
    reviews: 74,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop",
    description: "Loft de estilo industrial con techos altos y espacios amplios. Ideal para creativos y artistas que buscan inspiración.",
    host: {
      name: "Diego López",
      rating: 4.5,
      since: "2020"
    }
  },
  {
    id: 6,
    title: "Penthouse en Zona Rosa",
    location: "Zona Rosa, CDMX",
    price: "$65,000",
    rating: 4.9,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    description: "Exclusivo penthouse con vista panorámica de la ciudad. Lujo y elegancia en el corazón de la Zona Rosa.",
    host: {
      name: "Patricia Morales",
      rating: 4.9,
      since: "2018"
    }
  },
];

const amenities = [
  { icon: WifiIcon, name: "WiFi gratuito" },
  { icon: CarIcon, name: "Estacionamiento" },
  { icon: GymIcon, name: "Gimnasio" },
  { icon: CoffeeIcon, name: "Cocina equipada" },
  { icon: ShieldIcon, name: "Seguridad 24/7" },
];

const additionalImages = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=300&h=200&fit=crop",
];

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log('PropertyDetails - ID recibido:', id);

  // Encontrar la propiedad por ID
  const property = properties.find(p => p.id === Number(id));

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
      {/* Status Bar */}
      <View className="flex-row justify-between items-center px-6 py-2">
        <Text className="text-sm font-medium">9:41</Text>
        <View className="flex-row items-center gap-1">
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-6 h-3 border border-black rounded-sm">
            <View className="w-4 h-2 bg-black rounded-sm m-0.5" />
          </View>
        </View>
      </View>

      {/* Header with Back Button */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row items-center justify-between px-6 py-4">
        <Pressable
          className="bg-white/80 backdrop-blur-sm rounded-full p-3"
          onPress={goBack}
        >
          <ArrowLeftIcon />
        </Pressable>
        <View className="flex-row gap-2">
          <Pressable className="bg-white/80 backdrop-blur-sm rounded-full p-3">
            <ShareIcon />
          </Pressable>
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
          <Image
            source={{ uri: property.image }}
            className="w-full h-80"
            resizeMode="cover"
          />
          {/* Image Indicators */}
          <View className="absolute bottom-4 left-1/2 flex-row gap-2" style={{ transform: [{ translateX: -20 }] }}>
            {additionalImages.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6 pb-32">
          {/* Title and Rating */}
          <View className="mb-4">
            <View className="mb-2">
              <Text className="text-xl font-bold text-gray-900">{property.title}</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="flex-row items-center gap-1">
                <StarIcon />
                <Text className="text-sm font-semibold text-gray-900">{property.rating.toString()}</Text>
                <Text className="text-sm text-gray-600">({property.reviews} reseñas)</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-sm text-gray-600">{property.location}</Text>
            </View>
          </View>

          {/* Price */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-gray-900">{property.price}</Text>
                <Text className="text-sm text-gray-600">/mes</Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-800 text-sm font-medium">Disponible ahora</Text>
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

          {/* Amenities */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Amenidades</Text>
            </View>
            <View className="flex-row flex-wrap">
              {amenities.map((amenity, index) => (
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
                <Text className="text-sm font-medium text-gray-900">{property.location}</Text>
              </View>
              <Text className="text-sm text-gray-600">
                Excelente ubicación con acceso a restaurantes, cafeterías, centros comerciales y transporte público.
              </Text>
            </View>
          </View>

          {/* Host Info */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-900">Anfitrión</Text>
            </View>
            <View className="flex-row items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <View className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Text className="text-white text-sm font-bold">
                  {property.host.name.split(' ').map(n => n.charAt(0)).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-md font-semibold text-gray-900">{property.host.name}</Text>
                <View className="flex-row items-center gap-1">
                  <StarIcon />
                  <Text className="text-sm text-gray-600">{property.host.rating} • Anfitrión desde {property.host.since}</Text>
                </View>
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