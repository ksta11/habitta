import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
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
import Label from '../../../../components/atoms/Label';

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
        setValue('images', response.data.images?.map(img => ({ url_image: img.url_image })) || []);
        
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
        id_owner: property.id_owner
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
        <Pressable
          className="mt-4 bg-blue-500 rounded-lg px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white-traffic">
      {/* Header minimalista */}
      <View className="bg-lavender-indigo p-6 pt-10 flex-row">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-white-traffic text-2xl">←</Text>
        </Pressable>
        <Text className="text-white-traffic text-2xl font-semibold mt-2">  Editar</Text>
      </View>
      {/* Imágenes */}
      {property?.images && property.images.length > 0 && (
        <ImageCarousel 
          images={property.images.map(img => img.url_image)}
          height={200}
        />
      )}

      {/* Formulario */}
      <View className="p-6">
        {/* Información Básica */}
        <Label text="Información Básica" size="lg" weight="semibold" />
        <View className="mb-4" />
        
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Título"
              placeholder="Título de la propiedad"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
              borderColor="#A346E6"
              backgroundColor="#F6F6F6"
              labelColor="#A346E6"
              textColor="#1F1F1F"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Descripción"
              placeholder="Describe la propiedad"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              borderColor="#A346E6"
              backgroundColor="#F6F6F6"
              labelColor="#A346E6"
              textColor="#1F1F1F"
            />
          )}
        />

        {/* Ubicación */}
        <View className="mt-6" />
        <Label text="Ubicación" size="lg" weight="semibold" />
        <View className="mb-4" />

        <View className="flex-row">
          <View className="flex-1 mr-1">
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Dirección"
                  placeholder="Dirección"
                  value={value}
                  onChangeText={onChange}
                  error={errors.address?.message}
                  borderColor="#A346E6"
                  backgroundColor="#F6F6F6"
                  labelColor="#A346E6"
                  textColor="#1F1F1F"
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Ciudad"
                  placeholder="Ciudad"
                  value={value}
                  onChangeText={onChange}
                  error={errors.city?.message}
                  borderColor="#A346E6"
                  backgroundColor="#F6F6F6"
                  labelColor="#A346E6"
                  textColor="#1F1F1F"
                />
              )}
            />
          </View>
        </View>
        
        {/* Detalles */}
        <View className="mt-6" />
        <Label text="Detalles" size="lg" weight="semibold" />
        <View className="mb-4" />
        
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <PickerAtom
              label="Tipo"
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
              variant="habitta-light"
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Precio"
              placeholder="$0"
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              keyboardType="numeric"
              error={errors.price?.message}
              borderColor="#A346E6"
              backgroundColor="#F6F6F6"
              labelColor="#A346E6"
              textColor="#1F1F1F"
            />
          )}
        />

        <View className="flex-row">
          <View className="flex-1 mr-1">
            <Controller
              control={control}
              name="rooms"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Habitaciones"
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  keyboardType="numeric"
                  error={errors.rooms?.message}
                  borderColor="#A346E6"
                  backgroundColor="#F6F6F6"
                  labelColor="#A346E6"
                  textColor="#1F1F1F"
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="bathrooms"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Baños"
                  placeholder="0"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  keyboardType="numeric"
                  error={errors.bathrooms?.message}
                  borderColor="#A346E6"
                  backgroundColor="#F6F6F6"
                  labelColor="#A346E6"
                  textColor="#1F1F1F"
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="area"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Área (m²)"
              placeholder="0"
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              keyboardType="numeric"
              error={errors.area?.message}
              borderColor="#A346E6"
              backgroundColor="#F6F6F6"
              labelColor="#A346E6"
              textColor="#1F1F1F"
            />
          )}
        />

        <Controller
          control={control}
          name="services"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Servicios"
              placeholder="Agua, Luz, Gas..."
              value={value}
              onChangeText={onChange}
              error={errors.services?.message}
              borderColor="#A346E6"
              backgroundColor="#F6F6F6"
              labelColor="#A346E6"
              textColor="#1F1F1F"
            />
          )}
        />

        {/* Configuración */}
        <View className="mt-6" />
        <Label text="Configuración" size="lg" weight="semibold" />
        <View className="mb-4" />

        <Controller
          control={control}
          name="publication_status"
          render={({ field: { onChange, value } }) => (
            <PickerAtom
              label="Estado"
              value={value}
              onValueChange={onChange}
              options={[
                { label: 'Publicada', value: 'published' },
                { label: 'Rentada', value: 'rented' },
                { label: 'Deshabilitada', value: 'disabled' }
              ]}
              error={errors.publication_status?.message}
              variant="habitta-light"
            />
          )}
        />

        <View className="flex-row mt-6">
          <ButtonAtom
            title={isSubmitting ? 'Guardando...' : 'Guardar'}
            onPress={handleSubmit(onSubmit)}
            variant="habitta-primary"
            size="large"
            icon="save-outline"
            iconPosition="left"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="flex-1 mr-2"
          />
          
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
            className="flex-1"
          />
        </View>
      </View>
    </ScrollView>
  );
}

