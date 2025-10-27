import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, View, FlatList } from 'react-native';
import { Property } from '../../../interfaces/property/PropertyInterface';
import { getPropertyById } from '../../../libs/owner/property/api-service';
import PropertyHeader from '../../../components/molecules/PropertyHeader';
import PropertyImageGallery from '../../../components/molecules/PropertyImageGallery';
import PropertyTitle from '../../../components/molecules/PropertyTitle';
import PropertyPriceCard from '../../../components/molecules/PropertyPriceCard';
import PropertyDescription from '../../../components/molecules/PropertyDescription';
import PropertyAmenities from '../../../components/molecules/PropertyAmenities';
import PropertyLocation from '../../../components/molecules/PropertyLocation';
import PropertyInfoCard from '../../../components/molecules/PropertyInfoCard';
import PropertyBottomActions from '../../../components/molecules/PropertyBottomActions';
import ContactHostModal from '../Organisms/ContactHostModal';

// Servicios que podrían tener las propiedades
const defaultAmenities = [
  { icon: () => '📶', name: "WiFi gratuito" },
  { icon: () => '🚗', name: "Estacionamiento" },
  { icon: () => '🏋️', name: "Gimnasio" },
  { icon: () => '☕', name: "Cocina equipada" },
  { icon: () => '🛡️', name: "Seguridad 24/7" },
];

export default function PropertyDetailsModule() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);

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
    return ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'];
  };

  // Función helper para capitalizar texto
  const capitalizeText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Función helper para obtener amenidades basadas en los servicios
  const getAmenities = (services: string) => {
    return defaultAmenities;
  };

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  // Handlers
  const handleGoBack = () => {
    // Navegar específicamente a la vista general de propiedades
    router.push('/(user)/home');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleContactHost = () => {
    setIsContactModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsContactModalVisible(false);
  };

  const handleApplicationSuccess = () => {
    console.log('✅ Aplicación creada exitosamente para la propiedad:', property?.title);
  };

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#531A99" />
        <PropertyTitle 
          title="Cargando propiedad..." 
          type="" 
          address="" 
          city="" 
          rooms={0} 
          bathrooms={0} 
          area={0}
          loading={true}
        />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <PropertyTitle 
          title="Propiedad no encontrada" 
          type="" 
          address={`ID: ${id}`}
          city="" 
          rooms={0} 
          bathrooms={0} 
          area={0}
          notFound={true}
          onGoBack={handleGoBack}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Button */}
      <PropertyHeader
        onGoBack={handleGoBack}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <PropertyImageGallery
          images={getPropertyImages(property)}
          currentIndex={currentImageIndex}
          onIndexChange={handleImageIndexChange}
          flatListRef={flatListRef}
        />

        {/* Content */}
        <View className="px-6 py-6 pb-32">
          {/* Title and Info */}
          <PropertyTitle
            title={property.title}
            type={capitalizeText(property.type)}
            address={property.address}
            city={property.city}
            rooms={property.rooms}
            bathrooms={property.bathrooms}
            area={property.area}
          />

          {/* Price */}
          <PropertyPriceCard
            price={formatPrice(property.price)}
            status={property.publication_status}
          />

          {/* Description */}
          <PropertyDescription description={property.description} />

          {/* Services & Amenities */}
          <PropertyAmenities
            services={property.services}
            amenities={getAmenities(property.services)}
          />

          {/* Location */}
          <PropertyLocation
            address={property.address}
            city={property.city}
          />

          {/* Property Info */}
          <PropertyInfoCard
            publicationDate={property.publication_date}
            status={property.publication_status}
            area={property.area}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <PropertyBottomActions onContactHost={handleContactHost} />

      {/* Contact Host Modal */}
      <ContactHostModal
        visible={isContactModalVisible}
        onClose={handleCloseModal}
        propertyTitle={property?.title || 'esta propiedad'}
        propertyId={property?.id || ''}
        onSuccess={handleApplicationSuccess}
      />
    </View>
  );
}