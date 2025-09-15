import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPropertyById } from '../../../../libs/owner/property/api-service';
import { Property } from '../../../../interfaces/property/PropertyInterface';
import { PropertySchema, PropertyFormType } from '../../../../schemes/PropertySchema';
import ImageCarousel from '../../../../components/atoms/ImageCarousel';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';

interface ScreenEditProps {
  propertyId: string;
}

export default function ScreenEdit({ propertyId }: ScreenEditProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // React Hook Form configuration
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PropertyFormType>({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      price: 0,
      type: 'house',
      rooms: 0,
      bathrooms: 0,
      area: 0,
      services: '',
      publication_status: 'published',
      images: []
    }
  });

  const loadProperty = async () => {
    if (!propertyId) {
      Alert.alert('Error', 'ID de propiedad no válido');
      router.back();
      return;
    }

    try {
      console.log('🏠 Cargando propiedad con ID:', propertyId);
      const response = await getPropertyById(propertyId);
      
      if (response.success && response.data) {
        setProperty(response.data);
        
        // Fill form with property data
        setValue('title', response.data.title);
        setValue('description', response.data.description);
        setValue('address', response.data.address);
        setValue('city', response.data.city);
        setValue('price', response.data.price);
        setValue('type', response.data.type as 'house' | 'apartament' | 'store' | 'office' | 'werehouse');
        setValue('rooms', response.data.rooms);
        setValue('bathrooms', response.data.bathrooms);
        setValue('area', response.data.area);
        setValue('services', response.data.services);
        setValue('publication_status', response.data.publication_status as 'published' | 'rented' | 'disabled');
        setValue('images', response.data.images?.map(img => img.url_image) || []);
        
        console.log('✅ Propiedad cargada exitosamente:', response.data.title);
      } else {
        console.log('❌ Error al cargar propiedad:', response.message);
        Alert.alert('Error', response.message || 'No se pudo cargar la propiedad');
        router.back();
      }
    } catch (error) {
      console.error('💥 Error crítico:', error);
      Alert.alert('Error', 'Error de conexión al cargar la propiedad');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const onSubmit = async (data: PropertyFormType) => {
    try {
      console.log('📝 Datos del formulario:', data);
      // TODO: Implement API call to update property
      Alert.alert(
        'Éxito', 
        'Los datos están listos para enviar. El endpoint se implementará próximamente.',
        [
          {
            text: 'Ver datos en consola',
            onPress: () => console.table(data)
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      console.error('💥 Error al guardar:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los cambios');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Cargando propiedad...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 text-center">
          No se pudo cargar la propiedad
        </Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 rounded-lg px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 px-4 py-6 pt-12">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-4"
        >
          <Text className="text-white text-lg">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-3">Editar Propiedad</Text>
        
        {/* Title Input */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Título de la propiedad"
              placeholder="Ingresa el título..."
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />
      </View>

      {/* Images */}
      {property?.images && property.images.length > 0 && (
        <ImageCarousel 
          images={property.images.map(img => img.url_image)}
          height={256}
        />
      )}

      {/* Property Details */}
      <View className="p-4">
        {/* Location */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">📍 Ubicación</Text>
          
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Dirección"
                placeholder="Ingresa la dirección..."
                value={value}
                onChangeText={onChange}
                error={errors.address?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Ciudad"
                placeholder="Ingresa la ciudad..."
                value={value}
                onChangeText={onChange}
                error={errors.city?.message}
              />
            )}
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">📝 Descripción</Text>
          
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descripción"
                placeholder="Describe la propiedad..."
                value={value}
                onChangeText={onChange}
                error={errors.description?.message}
              />
            )}
          />
        </View>

        {/* Property Features */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">🏠 Características</Text>
          
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <PickerAtom
                label="Tipo de propiedad"
                value={value}
                onValueChange={onChange}
                options={[
                  { label: 'Casa', value: 'house' },
                  { label: 'Apartamento', value: 'apartament' },
                  { label: 'Tienda', value: 'store' },
                  { label: 'Oficina', value: 'office' },
                  { label: 'Bodega', value: 'werehouse' }
                ]}
                error={errors.type?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Precio"
                placeholder="Ingresa el precio..."
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
                error={errors.price?.message}
              />
            )}
          />
          
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="rooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Habitaciones"
                    placeholder="# habitaciones"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    keyboardType="numeric"
                    error={errors.rooms?.message}
                  />
                )}
              />
            </View>
            
            <View className="flex-1">
              <Controller
                control={control}
                name="bathrooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Baños"
                    placeholder="# baños"
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                    keyboardType="numeric"
                    error={errors.bathrooms?.message}
                  />
                )}
              />
            </View>
          </View>
          
          <Controller
            control={control}
            name="area"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Área (m²)"
                placeholder="Ingresa el área en metros cuadrados"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                keyboardType="numeric"
                error={errors.area?.message}
              />
            )}
          />
        </View>

        {/* Services */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">⚡ Servicios</Text>
          
          <Controller
            control={control}
            name="services"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Servicios"
                placeholder="Ej: Agua, Luz, Gas, Internet..."
                value={value}
                onChangeText={onChange}
                error={errors.services?.message}
              />
            )}
          />
        </View>

        {/* Publication Status */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">📊 Estado de Publicación</Text>
          
          <Controller
            control={control}
            name="publication_status"
            render={({ field: { onChange, value } }) => (
              <PickerAtom
                label="Estado de la propiedad"
                value={value}
                onValueChange={onChange}
                options={[
                  { label: 'Publicada', value: 'published' },
                  { label: 'Rentada', value: 'rented' },
                  { label: 'Deshabilitada', value: 'disabled' }
                ]}
                error={errors.publication_status?.message}
              />
            )}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className={`flex-1 rounded-lg py-4 ${
              isSubmitting ? 'bg-gray-400' : 'bg-green-500'
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-bold">
              {isSubmitting ? '💾 Guardando...' : '💾 Guardar Cambios'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-gray-500 rounded-lg py-4"
            onPress={() => {
              Alert.alert(
                'Cancelar',
                '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Sí, cancelar', 
                    style: 'destructive',
                    onPress: () => router.back()
                  }
                ]
              );
            }}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-bold">❌ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
