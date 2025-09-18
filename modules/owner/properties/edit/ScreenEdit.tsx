import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPropertyById, updateProperty } from '../../../../libs/owner/property/api-service';
import { Property, UpdatePropertyDTO } from '../../../../interfaces/property/PropertyInterface';
import { EditPropertySchema, EditPropertyFormType } from '../../../../schemes/PropertySchema';
import ImageCarousel from '../../../../components/atoms/ImageCarousel';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';

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
  } = useForm<EditPropertyFormType>({
    resolver: zodResolver(EditPropertySchema),
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

  const onSubmit = async (data: EditPropertyFormType) => {
    try {
      console.log('📝 Datos del formulario:', data);
      
      if (!property?.id) {
        Alert.alert('Error', 'ID de propiedad no válido');
        return;
      }
      
      // Preparar datos para la API (agregar id_owner)
      const updateData: UpdatePropertyDTO = {
        ...data,
        id_owner: property.id_owner,
        images: data.images || []
      };
      
      console.log('🔄 Enviando actualización de propiedad...');
      const response = await updateProperty(property.id, updateData);
      
      if (response.success) {
        console.log('✅ Propiedad actualizada exitosamente');
        Alert.alert(
          'Éxito', 
          response.message || 'Los cambios se han guardado correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        console.log('❌ Error al actualizar:', response.message);
        Alert.alert('Error', response.message || 'No se pudieron guardar los cambios');
      }
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
      <View className="bg-violet px-4 py-6 pt-12">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mb-4"
        >
          <Text className="text-white text-lg">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-3">Editar Propiedad</Text>
      </View>

      {/* Property Title Section */}
      <View className="px-4 py-4 bg-gray-50">
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
              borderColor="#8B5CF6"
              backgroundColor="#FFFFFF"
              labelColor="#8B5CF6"
              textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                    borderColor="#8B5CF6"
                    backgroundColor="#FFFFFF"
                    labelColor="#8B5CF6"
                    textColor="#1F2937"
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
                    borderColor="#8B5CF6"
                    backgroundColor="#FFFFFF"
                    labelColor="#8B5CF6"
                    textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
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
                borderColor="#8B5CF6"
                backgroundColor="#FFFFFF"
                labelColor="#8B5CF6"
                textColor="#1F2937"
              />
            )}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6">
          <View className="flex-1">
            <ButtonAtom
              title={isSubmitting ? 'Guardando...' : 'Guardar'}
              onPress={handleSubmit(onSubmit)}
              variant="success"
              size="large"
              icon="save-outline"
              iconPosition="left"
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth={true}
            />
          </View>
          
          <View className="flex-1">
            <ButtonAtom
              title="Cancelar"
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
              variant="secondary"
              size="large"
              icon="close-outline"
              iconPosition="left"
              disabled={isSubmitting}
              fullWidth={true}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
