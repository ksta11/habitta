import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Pressable, Alert, Image, Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Label from "../../components/atoms/Label";
import Input from "../../components/atoms/Input";
import {
  getOwnerProperties,
  deleteProperty,
} from "../../libs/owner/property/api-service";
import { Property } from "../../interfaces/property/PropertyInterface";

// Iconos simulados con emojis
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Text>{filled ? "❤️" : "🤍"}</Text>
);
const StarIcon = () => <Text>⭐</Text>;
const LocationIcon = () => <Text>📍</Text>;
const UserIcon = () => <Text>👤</Text>;

const categories = [
  { id: 1, name: "Apartamentos", icon: "🏢", active: true },
  { id: 2, name: "Casas", icon: "🏠", active: false },
  { id: 3, name: "Apartaestudios de un ambiente", icon: "🏢", active: false },
  { id: 4, name: "Apartaestudios de dos ambiente", icon: "🏘️", active: false },
  { id: 5, name: "Apartamentos duplex", icon: "🏠", active: false },
];

const properties = [
  {
    id: 1,
    title: "Apartamento moderno en Polanco",
    location: "Polanco, CDMX",
    price: "$25,000",
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Casa con jardín en Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$35,000",
    rating: 4.8,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Oficina ejecutiva en Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$45,000",
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Co-living en Condesa",
    location: "Condesa, CDMX",
    price: "$18,000",
    rating: 4.6,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
    isFavorite: false,
  },
  {
    id: 5,
    title: "Loft industrial en Doctores",
    location: "Doctores, CDMX",
    price: "$22,000",
    rating: 4.5,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=200&fit=crop",
    isFavorite: true,
  },
  {
    id: 6,
    title: "Penthouse en Zona Rosa",
    location: "Zona Rosa, CDMX",
    price: "$65,000",
    rating: 4.9,
    reviews: 45,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop",
    isFavorite: false,
  },
];

export default function Home() {
  const [favorites, setFavorites] = useState<number[]>([2, 5]);
  const [activeTab, setActiveTab] = useState("home");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const navigateToProperty = (propertyId: number) => {
    console.log("Navegando a:", `/(user)/(home)/${propertyId}`);
    router.push(`/(user)/(home)/${propertyId}`);
  };

  const loadProperties = async () => {
    try {
      console.log("🏠 Cargando propiedades...");
      const response = await getOwnerProperties();

      if (response.success) {
        setProperties(response.data);
        console.log(
          `✅ ${response.data.length} propiedades cargadas exitosamente`
        );
      } else {
        console.log("❌ Error al cargar propiedades:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudieron cargar las propiedades"
        );
      }
    } catch (error) {
      console.error("💥 Error crítico:", error);
      Alert.alert("Error", "Error de conexión al cargar las propiedades");
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
      console.log("🔄 Pantalla de propiedades enfocada, recargando datos...");
      loadProperties();
    }, [])
  );
  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <View className="flex-row justify-between items-center px-6 py-2">
        <Label text="9:41" size="sm" weight="medium" />
        <View className="flex-row items-center gap-1">
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-4 h-2 bg-black rounded-sm" />
          <View className="w-6 h-3 border border-black rounded-sm">
            <View className="w-4 h-2 bg-black rounded-sm m-0.5" />
          </View>
        </View>
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Text className="text-white text-sm font-bold">H</Text>
          </View>
          <View>
            <Label text="Habitta" size="lg" weight="bold" />
            <Label
              text="Encuentra tu espacio ideal"
              size="sm"
              variant="default"
            />
          </View>
        </View>
        <Pressable className="rounded-full p-2">
          <UserIcon />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 relative">
              <Input placeholder="¿Dónde quieres buscar?" />
            </View>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex gap-3"
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
                  category.active ? "bg-blue-600" : "bg-gray-100"
                }`}
              >
                <Text>{category.icon}</Text>
                {category.active ? (
                  <Text className="text-white text-sm font-medium">
                    {category.name}
                  </Text>
                ) : (
                  <Label text={category.name} size="sm" weight="medium" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Properties List */}
        <View className="px-6 pb-24">
          <View className="flex-row items-center justify-between mb-4">
            <Label text="Propiedades destacadas" size="lg" weight="semibold" />
            <Pressable>
              <Text className="text-blue-600 text-sm">Ver todas</Text>
            </Pressable>
          </View>

          <View className="space-y-4">
            {properties.map((property) => (
              <Pressable
                key={property.id}
                onPress={() => navigateToProperty(property.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <View className="relative">
                  <Image
                    source={{ uri: property.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <Pressable
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2"
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                  >
                    <HeartIcon filled={favorites.includes(property.id)} />
                  </Pressable>
                </View>
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Label
                        text={property.title}
                        size="md"
                        weight="semibold"
                      />
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1 mb-2">
                    <LocationIcon />
                    <Label
                      text={property.location}
                      size="sm"
                      variant="default"
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                      <StarIcon />
                      <Label
                        text={property.rating.toString()}
                        size="sm"
                        weight="medium"
                      />
                      <Label
                        text={`(${property.reviews})`}
                        size="sm"
                        variant="default"
                      />
                    </View>
                    <View className="items-end">
                      <Label text={property.price} size="lg" weight="bold" />
                      <Label text="/mes" size="sm" variant="default" />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
