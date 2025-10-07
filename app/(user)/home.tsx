import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Text,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Label from "../../components/atoms/Label";
import Input from "../../components/atoms/Input";
import { 
  searchProperties, 
  getAllPublishedProperties, 
  getAvailableCities,
  PropertySearchFilters 
} from "../../libs/user/property-search-service";
import { Property } from "../../interfaces/property/PropertyInterface";

// Iconos simulados con emojis
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Text>{filled ? "❤️" : "🤍"}</Text>
);
const StarIcon = () => <Text>⭐</Text>;
const LocationIcon = () => <Text>📍</Text>;
const UserIcon = () => <Text>👤</Text>;

const categories = [
  { id: 1, name: "Apartamentos", icon: "🏢", value: "apartament" },
  { id: 2, name: "Casas", icon: "🏠", value: "house" },
  { id: 3, name: "Oficinas", icon: "🏢", value: "office" },
  { id: 4, name: "Locales", icon: "🏪", value: "store" },
  { id: 5, name: "Bodegas", icon: "🏭", value: "werehouse" },
];

// Interfaces para filtros (ajustada para coincidir con el backend)
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

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Estados para filtros
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: '',
    category: 'todos',
    city: 'todos',
    priceRange: { min: 0, max: 5000000 },
    rooms: 0,
    bathrooms: 0,
    areaRange: { min: 0, max: 500 }
  });
  
  const router = useRouter();

  // Función para cargar ciudades disponibles
  const loadAvailableCities = async () => {
    try {
      const cities = await getAvailableCities();
      setAvailableCities(cities);
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
    }
  };

  // Función para aplicar filtros usando el backend
  const applyFilters = async () => {
    try {
      setLoading(true);
      console.log('🔍 Aplicando filtros:', filters);
      
      // Mapear filtros del frontend al formato del backend
      const backendFilters: PropertySearchFilters = {};
      
      // Solo enviar filtros que tengan valores válidos
      if (filters.city !== 'todos') {
        backendFilters.city = filters.city;
      }
      
      if (filters.priceRange.min > 0) {
        backendFilters.minPrice = filters.priceRange.min;
      }
      
      if (filters.priceRange.max < 5000000) {
        backendFilters.maxPrice = filters.priceRange.max;
      }
      
      if (filters.rooms > 0) {
        backendFilters.minRooms = filters.rooms;
      }
      
      if (filters.bathrooms > 0) {
        backendFilters.minBathrooms = filters.bathrooms;
      }
      
      if (filters.areaRange.min > 0) {
        backendFilters.minArea = filters.areaRange.min;
      }
      
      if (filters.areaRange.max < 500) {
        backendFilters.maxArea = filters.areaRange.max;
      }
      
      if (filters.category !== 'todos') {
        backendFilters.type = filters.category;
      }
      
      const response = await searchProperties(backendFilters);
      
      if (response.success) {
        let filteredData = response.data;
        
        // Aplicar filtro de búsqueda por texto en el frontend (si el backend no lo soporta)
        if (filters.searchTerm) {
          filteredData = filteredData.filter(property =>
            property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            property.city.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }
        
        setProperties(filteredData);
        console.log(`✅ ${filteredData.length} propiedades encontradas con filtros`);
      } else {
        console.log('❌ Error al aplicar filtros:', response.message);
        Alert.alert('Error', response.message || 'No se pudieron aplicar los filtros');
        setProperties([]);
      }
    } catch (error) {
      console.error('💥 Error crítico al aplicar filtros:', error);
      Alert.alert('Error', 'Error de conexión al aplicar filtros');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear filtros
  const resetFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      category: 'todos',
      city: 'todos',
      priceRange: { min: 0, max: 5000000 },
      rooms: 0,
      bathrooms: 0,
      areaRange: { min: 0, max: 500 }
    };
    setFilters(defaultFilters);
    // Aplicar filtros después de resetear
    setTimeout(() => applyFilters(), 100);
  };

  // Función para actualizar filtros
  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función para cargar propiedades iniciales
  const loadProperties = async () => {
    try {
      console.log("🏠 Cargando propiedades iniciales...");
      setLoading(true);
      
      const response = await getAllPublishedProperties();

      if (response.success) {
        setProperties(response.data);
        console.log(`✅ ${response.data.length} propiedades cargadas exitosamente`);
      } else {
        console.log("❌ Error al cargar propiedades:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudieron cargar las propiedades"
        );
        setProperties([]);
      }
    } catch (error) {
      console.error("💥 Error crítico:", error);
      Alert.alert("Error", "Error de conexión al cargar las propiedades");
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const navigateToProperty = (propertyId: string) => {
    console.log("Navegando a:", `/(user)/(home)/${propertyId}`);
    router.push(`/(user)/(home)/${propertyId}`);
  };

  // Función helper para formatear el precio
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString("es-MX")}`;
  };

  // Función helper para obtener la primera imagen
  const getPropertyImage = (property: Property): string => {
    return property.images && property.images.length > 0
      ? property.images[0].url_image
      : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop"; // imagen por defecto
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
  };

  const handleApplyFilters = async () => {
    await applyFilters();
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadProperties();
    loadAvailableCities();
  }, []);

  // Aplicar filtros cuando cambien (con debounce para búsqueda)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.searchTerm !== '' || 
          filters.category !== 'todos' || 
          filters.city !== 'todos' ||
          filters.priceRange.min > 0 ||
          filters.priceRange.max < 5000000 ||
          filters.rooms > 0 ||
          filters.bathrooms > 0 ||
          filters.areaRange.min > 0 ||
          filters.areaRange.max < 500) {
        applyFilters();
      }
    }, 500); // Debounce de 500ms para la búsqueda de texto

    return () => clearTimeout(timeoutId);
  }, [filters.searchTerm]);

  // Recargar propiedades cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Pantalla de propiedades enfocada, recargando datos...");
      loadProperties();
    }, [])
  );
  return (
    <View className="flex-1 bg-white">
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#3B82F6"]} // Android
            tintColor="#3B82F6" // iOS
          />
        }
      >
        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 relative">
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                <FontAwesome name="search" size={16} color="#6b7280" />
                <TextInput
                  placeholder="¿Dónde quieres buscar?"
                  value={filters.searchTerm}
                  onChangeText={(text) => updateFilter('searchTerm', text)}
                  className="flex-1 ml-3 text-gray-800"
                  placeholderTextColor="#9ca3af"
                  onSubmitEditing={handleApplyFilters}
                />
              </View>
            </View>
            <Pressable 
              onPress={() => setShowFilters(true)}
              className="bg-blue-600 px-4 py-3 rounded-lg flex-row items-center"
            >
              <FontAwesome name="filter" size={16} color="white" />
              <Text className="text-white ml-2 font-medium">Filtros</Text>
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex gap-3"
          >
            <Pressable
              onPress={() => {
                updateFilter('category', 'todos');
                setTimeout(handleApplyFilters, 100);
              }}
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
                filters.category === 'todos' ? "bg-blue-600" : "bg-gray-100"
              }`}
            >
              <Text>🏠</Text>
              <Text className={`text-sm font-medium ${
                filters.category === 'todos' ? "text-white" : "text-gray-700"
              }`}>
                Todos
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => {
                  updateFilter('category', category.value);
                  setTimeout(handleApplyFilters, 100);
                }}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
                  filters.category === category.value ? "bg-blue-600" : "bg-gray-100"
                }`}
              >
                <Text>{category.icon}</Text>
                <Text className={`text-sm font-medium ${
                  filters.category === category.value ? "text-white" : "text-gray-700"
                }`}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Properties List */}
        <View className="px-6 pb-24">
          <View className="flex-row items-center justify-between mb-4">
            <Label text={`Propiedades (${properties.length})`} size="lg" weight="semibold" />
            <Pressable>
              <Text className="text-blue-600 text-sm">Ver todas</Text>
            </Pressable>
          </View>

          <View>
            {loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-600">Cargando propiedades...</Text>
              </View>
            ) : properties.length === 0 ? (
              <View className="flex-1 justify-center items-center py-20">
                <FontAwesome name="search" size={48} color="#d1d5db" />
                <Text className="text-gray-600 text-center mt-4">
                  {filters.searchTerm || filters.category !== 'todos' || filters.city !== 'todos' ||
                   filters.priceRange.min > 0 || filters.priceRange.max < 5000000 ||
                   filters.rooms > 0 || filters.bathrooms > 0 ||
                   filters.areaRange.min > 0 || filters.areaRange.max < 500
                    ? "No se encontraron propiedades con los filtros aplicados"
                    : "No hay propiedades disponibles para alquiler"}
                </Text>
                {(filters.searchTerm || filters.category !== 'todos' || filters.city !== 'todos' ||
                  filters.priceRange.min > 0 || filters.priceRange.max < 5000000 ||
                  filters.rooms > 0 || filters.bathrooms > 0 ||
                  filters.areaRange.min > 0 || filters.areaRange.max < 500) && (
                  <Pressable 
                    onPress={resetFilters}
                    className="bg-blue-100 px-4 py-2 rounded-lg mt-4"
                  >
                    <Text className="text-blue-800 font-medium">Limpiar filtros</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              properties.map((property: Property) => (
                <Pressable
                  key={property.id}
                  onPress={() => navigateToProperty(property.id)}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-4"
                >
                  <View className="relative">
                    <Image
                      source={{ uri: getPropertyImage(property) }}
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
                        text={`${property.address}, ${property.city}`}
                        size="sm"
                        variant="default"
                      />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-1">
                        <Text className="text-sm text-gray-600 capitalize">
                          {property.type}
                        </Text>
                        <Text className="text-sm text-gray-400">•</Text>
                        <Text className="text-sm text-gray-600">
                          {property.rooms} hab • {property.bathrooms} baños
                        </Text>
                      </View>
                      <View className="items-end">
                        <Label
                          text={formatPrice(property.price)}
                          size="lg"
                          weight="bold"
                        />
                        <Label text="/mes" size="sm" variant="default" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header del Modal */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">Filtros</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <FontAwesome name="times" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            {/* Filtro por Ciudad */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Ciudad</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                  onPress={() => updateFilter('city', 'todos')}
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
                    onPress={() => updateFilter('city', city)}
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
                      updateFilter('priceRange', { ...filters.priceRange, min: value });
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
                      updateFilter('priceRange', { ...filters.priceRange, max: value });
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
                    onPress={() => updateFilter('priceRange', { 
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
                    onPress={() => updateFilter('rooms', rooms)}
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
                    onPress={() => updateFilter('bathrooms', bathrooms)}
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
                      updateFilter('areaRange', { ...filters.areaRange, min: value });
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
                      updateFilter('areaRange', { ...filters.areaRange, max: value });
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
                onPress={resetFilters}
                className="flex-1 bg-gray-100 py-3 rounded-lg items-center"
              >
                <Text className="text-gray-800 font-medium">Limpiar filtros</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleApplyFilters();
                  setShowFilters(false);
                }}
                className="flex-1 bg-blue-600 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-medium">
                  Aplicar ({properties.length})
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
