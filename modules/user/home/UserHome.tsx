import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Label from "../../../components/atoms/Label";
import PropertyCard from "../../../components/molecules/PropertyCard";
import { useAuth } from "../../../contexts/AuthContext";
import { PropertySearchFilters } from "../../../libs/user/property-search-service";
import { PropertyFilters as IPropertyFilters,useFavorites,useProperties,usePropertyFilters,usePropertyNavigation,useReviewNavigation,} from "../hooks";
import CategorySelector from "../Molecules/CategorySelector";
import HomeHeader from "../Molecules/HomeHeader";
import SearchFilter from "../Molecules/SearchFilter";
import FiltersModal from "../Organisms/FiltersModal";
import { hapticFeedback } from "../../../utils/haptics";

/**
 * Categorías disponibles para propiedades
 */
const categories = [
  { id: 1, name: "Apartamento", icon: "🏢", value: "apartament" },
  { id: 2, name: "Casa", icon: "🏠", value: "house" },
  { id: 3, name: "Oficina", icon: "🏢", value: "office" },
  { id: 4, name: "Local", icon: "🏪", value: "store" },
  { id: 5, name: "Bodega", icon: "🏭", value: "werehouse" },
];

export const UserHome = () => {
  console.log('🏠 [UserHome] Iniciando renderizado del componente UserHome');

  // Router para navegación
  const router = useRouter();

  // Contexto de autenticación
  const { user, logout } = useAuth();

  // === HOOKS DE PROPIEDADES ===
  const {
    properties,loading,refreshing,searchPropertiesWithFilters,refresh,formatPrice,getPropertyImage,} = useProperties();

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Hook de navegación de propiedades
  const { navigateToProperty } = usePropertyNavigation();
// Hook de navegación de reseñas
  const { navigateToReviewList } = useReviewNavigation();

  // === HOOKS DE FILTROS ===
  /**
   * Maneja la aplicación de filtros
   * Convierte los filtros del hook al formato del backend
   */
  function handleFiltersApply(filters: IPropertyFilters) {
    console.log("🔄 [HomeModule] Aplicando filtros:", filters);

    const backendFilters: PropertySearchFilters = {
      searchTerm: filters.searchTerm || undefined,
      type: filters.category || undefined,
      city: filters.city || undefined,
      minPrice: filters.priceRange.min
        ? parseFloat(filters.priceRange.min)
        : undefined,
      maxPrice: filters.priceRange.max
        ? parseFloat(filters.priceRange.max)
        : undefined,
      minRooms: filters.rooms ? parseInt(filters.rooms) : undefined,
      minBathrooms: filters.bathrooms ? parseInt(filters.bathrooms) : undefined,
      minArea: filters.areaRange.min
        ? parseFloat(filters.areaRange.min)
        : undefined,
      maxArea: filters.areaRange.max
        ? parseFloat(filters.areaRange.max)
        : undefined,
    };

    searchPropertiesWithFilters(backendFilters);
  }

  // === Hooks de filtros personalizados 
  const {
    filters,
    showFilters,
    availableCities,
    updateFilter,
    applyFiltersWithCategory,
    applyFiltersImmediately,
    resetFilters,
    toggleFiltersModal,
  } = usePropertyFilters(handleFiltersApply);

  /**
   * Maneja el cambio de categoría
   */
  const handleCategoryChange = (category: string) => {
    // Feedback háptico al cambiar categoría
    hapticFeedback.selection();
    applyFiltersWithCategory(category);
  };

  /**
   * Maneja el toggle de favorito
   */
  const handleToggleFavorite = (propertyId: string) => {
    toggleFavorite(propertyId);
  };

  /**
   * Maneja la navegación a los detalles de una propiedad
   */
  const handlePropertyPress = (propertyId: string) => {
    navigateToProperty(propertyId);
  };

  /**
   * Efecto para recargar propiedades cuando la pantalla recibe foco
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log(
        "👀 [HomeModule] Pantalla en foco, recargando propiedades..."
      );
      refresh();
    }, [])
  );

  return (
    <View className="flex-1 bg-white">
      <View>
        <HomeHeader 
          onNavigateToReviews={navigateToReviewList}
          userName={user?.name || user?.email || "Usuario"}
          userEmail={user?.email}
          userPhoto={undefined} // El tipo User no tiene photoUrl aún
          onNavigateToProfile={() => {
            hapticFeedback.buttonPressLight();
            router.push("/(user)/profile");
          }}
          onNavigateToSettings={() => {
            hapticFeedback.buttonPressLight();
            router.push("/(user)/(settings)");
          }}
          onLogout={async () => {
            hapticFeedback.buttonPress();
            await logout();
            router.replace("/auth/login");
          }}
        />
      </View>

      {/* Búsqueda y Filtros */}
      <View className="px-4 pt-4">
        <SearchFilter
          searchTerm={filters.searchTerm}
          onSearchChange={(value: string) => updateFilter("searchTerm", value)}
          onSubmit={() => console.log("Submit search")}
          onShowFilters={() => {
            // Feedback háptico al abrir modal de filtros
            hapticFeedback.selection();
            toggleFiltersModal();
          }}
        />
      </View>

      {/* Categorías */}
      <View className="pt-4">
        <CategorySelector
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={handleCategoryChange}
        />
      </View>

      {/* Lista de Propiedades */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#531A99"]}
            tintColor="#531A99"
          />
        }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            isFavorite={isFavorite(item.id)}
            onPress={() => handlePropertyPress(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            formatPrice={formatPrice}
            getPropertyImage={getPropertyImage}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-12">
              <Label
                text={
                  filters.searchTerm || filters.category || filters.city
                    ? "No se encontraron propiedades con los filtros aplicados"
                    : "No hay propiedades disponibles"
                }
                size="sm"
                variant="default"
              />
            </View>
          ) : null
        }
      />

      {/* Modal de Filtros */}
      <FiltersModal
        visible={showFilters}
        filters={{
          searchTerm: filters.searchTerm,
          category: filters.category,
          city: filters.city,
          priceRange: {
            min: filters.priceRange.min
              ? parseFloat(filters.priceRange.min)
              : 0,
            max: filters.priceRange.max
              ? parseFloat(filters.priceRange.max)
              : 0,
          },
          rooms: filters.rooms ? parseInt(filters.rooms) : 0,
          bathrooms: filters.bathrooms ? parseInt(filters.bathrooms) : 0,
          areaRange: {
            min: filters.areaRange.min ? parseFloat(filters.areaRange.min) : 0,
            max: filters.areaRange.max ? parseFloat(filters.areaRange.max) : 0,
          },
        }}
        availableCities={availableCities}
        propertiesCount={properties.length}
        onClose={() => {
          // Feedback háptico al cerrar modal
          hapticFeedback.selection();
          toggleFiltersModal();
        }}
        onUpdateFilter={(key: string, value: any) => {
          if (key === "priceRange" || key === "areaRange") {
            updateFilter(key as any, {
              min: value.min.toString(),
              max: value.max.toString(),
            });
          } else if (key === "rooms" || key === "bathrooms") {
            updateFilter(key as any, value.toString());
          } else {
            updateFilter(key as any, value);
          }
        }}
        onResetFilters={() => {
          // Feedback háptico al resetear filtros
          hapticFeedback.refresh();
          resetFilters();
        }}
        onApplyFilters={() => {
          // Feedback háptico al aplicar filtros
          hapticFeedback.buttonPress();
          applyFiltersImmediately();
          toggleFiltersModal();
        }}
      />
    </View>
  );
};
export default UserHome;
