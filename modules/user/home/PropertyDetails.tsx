import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import AlertModal from '../../../components/atoms/AlertModal';
import PropertyAmenities from '../../../components/molecules/PropertyAmenities';
import PropertyBottomActions from '../../../components/molecules/PropertyBottomActions';
import PropertyDescription from '../../../components/molecules/PropertyDescription';
import PropertyImageGallery from '../../../components/molecules/PropertyImageGallery';
import PropertyInfoCard from '../../../components/molecules/PropertyInfoCard';
import PropertyLocation from '../../../components/molecules/PropertyLocation';
import PropertyPriceCard from '../../../components/molecules/PropertyPriceCard';
import PropertyTitle from '../../../components/molecules/PropertyTitle';
import { Property } from '../../../interfaces/property/PropertyInterface';
import { getPropertyById } from '../../../libs/owner/property/api-service';
import ContactHostModal from '../Organisms/ContactHostModal';

// Mapeo de íconos para cada tipo de servicio
const serviceIcons: { [key: string]: string } = {
  agua: '💧',
  gas: '🔥',
  luz: '⚡',
  internet: '📶',
  parabolica: '📺',
  administracion: '🏢',
  parqueadero: '🚗',
  nevera: '🧊',
  lavadora: '🧺',
  televisor: '📺',
  sofa: '🛋️',
  cama: '🛏️',
  mesa: '🍽️',
  sillas: '🪑',
  lavavajillas: '🍽️',
  microondas: '🔥',
  'aire acondicionado': '❄️',
  calefaccion: '🔥',
};

// Mapeo de nombres legibles para los servicios
const serviceNames: { [key: string]: string } = {
  agua: 'Agua',
  gas: 'Gas',
  luz: 'Luz',
  internet: 'Internet',
  parabolica: 'Parabólica',
  administracion: 'Administración',
  parqueadero: 'Parqueadero',
  nevera: 'Nevera',
  lavadora: 'Lavadora',
  televisor: 'Televisor',
  sofa: 'Sofá',
  cama: 'Cama',
  mesa: 'Mesa',
  sillas: 'Sillas',
  lavavajillas: 'Lavavajillas',
  microondas: 'Microondas',
  'aire acondicionado': 'Aire acondicionado',
  calefaccion: 'Calefacción',
};

export default function PropertyDetailsModule() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);
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
        setAlertData({ type: 'error', title: 'Error', message: response.message || "No se pudo cargar la propiedad" });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('💥 Error crítico:', error);
      setAlertData({ type: 'error', title: 'Error', message: "Error de conexión al cargar la propiedad" });
      setAlertVisible(true);
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
    if (!services) return [];
    
    const serviceList = services.split(',').map(s => s.trim().toLowerCase());
    
    return serviceList
      .filter(service => service && serviceIcons[service])
      .map(service => ({
        icon: () => serviceIcons[service],
        name: serviceNames[service] || service.charAt(0).toUpperCase() + service.slice(1)
      }));
  };

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  // Handlers
  const handleGoBack = () => {
    // Navegar específicamente a la vista general de propiedades
    router.push('/(user)/(home)');
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

      {/* Alert Modal */}
      {alertVisible && alertData && (
        <AlertModal
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
        />
      )}
    </View>
  );
}