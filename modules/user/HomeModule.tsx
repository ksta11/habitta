import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Alert,
  Text,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Label from "../../components/atoms/Label";
import HomeHeader from "../../components/molecules/HomeHeader";
import SearchFilter from "../../components/molecules/SearchFilter";
import CategorySelector from "../../components/molecules/CategorySelector";
import PropertyCard from "../../components/molecules/PropertyCard";
import FiltersModal from "../../components/molecules/FiltersModal";
import { 
  searchProperties, 
  getAllPublishedProperties, 
  getAvailableCities,
  PropertySearchFilters 
} from "../../libs/user/property-search-service";
import { Property } from "../../interfaces/property/PropertyInterface";

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

export default function HomeModule() {
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

  // Función para aplicar filtros con categoría específica (evita race condition)
  const applyFiltersWithCategory = async (categoryValue: string) => {
    try {
      setLoading(true);
      console.log('🔍 Aplicando filtros con categoría:', categoryValue);
      
      // Crear filtros temporales con la nueva categoría
      const tempFilters = { ...filters, category: categoryValue };
      
      // Mapear filtros del frontend al formato del backend
      const backendFilters: PropertySearchFilters = {};
      
      // Solo enviar filtros que tengan valores válidos
      if (tempFilters.city !== 'todos') {
        backendFilters.city = tempFilters.city;
      }
      
      if (tempFilters.priceRange.min > 0) {
        backendFilters.minPrice = tempFilters.priceRange.min;
      }
      
      if (tempFilters.priceRange.max < 5000000) {
        backendFilters.maxPrice = tempFilters.priceRange.max;
      }
      
      if (tempFilters.rooms > 0) {
        backendFilters.minRooms = tempFilters.rooms;
      }
      
      if (tempFilters.bathrooms > 0) {
        backendFilters.minBathrooms = tempFilters.bathrooms;
      }
      
      if (tempFilters.areaRange.min > 0) {
        backendFilters.minArea = tempFilters.areaRange.min;
      }
      
      if (tempFilters.areaRange.max < 500) {
        backendFilters.maxArea = tempFilters.areaRange.max;
      }
      
      if (categoryValue !== 'todos') {
        backendFilters.type = categoryValue;
      }
      
      const response = await searchProperties(backendFilters);
      
      if (response.success) {
        let filteredData = response.data;
        
        // Aplicar filtro de búsqueda por texto en el frontend (si el backend no lo soporta)
        if (tempFilters.searchTerm) {
          filteredData = filteredData.filter(property =>
            property.title.toLowerCase().includes(tempFilters.searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(tempFilters.searchTerm.toLowerCase()) ||
            property.city.toLowerCase().includes(tempFilters.searchTerm.toLowerCase())
          );
        }
        
        setProperties(filteredData);
        console.log(`✅ ${filteredData.length} propiedades encontradas con categoría: ${categoryValue}`);
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

  const handleCategorySelect = (categoryValue: string) => {
    updateFilter('category', categoryValue);
    applyFiltersWithCategory(categoryValue);
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HomeHeader onNavigateToReviews={() => {
        console.log('🚀 [HomeModule] Función de navegación a reviews ejecutada');
        console.log('🚀 [HomeModule] Navegando a: /(user)/(review)');
        router.push("/(user)/(review)");
        console.log('🚀 [HomeModule] router.push ejecutado');
      }} />

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
        <SearchFilter
          searchTerm={filters.searchTerm}
          onSearchChange={(text) => updateFilter('searchTerm', text)}
          onSubmit={handleApplyFilters}
          onShowFilters={() => setShowFilters(true)}
        />

        {/* Categories */}
        <CategorySelector
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={handleCategorySelect}
        />

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
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onPress={() => navigateToProperty(property.id)}
                  onToggleFavorite={() => toggleFavorite(property.id)}
                  formatPrice={formatPrice}
                  getPropertyImage={getPropertyImage}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Filtros */}
      <FiltersModal
        visible={showFilters}
        filters={filters}
        availableCities={availableCities}
        propertiesCount={properties.length}
        onClose={() => setShowFilters(false)}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}