
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import ImageUploader from '../../../../components/atoms/ImageUploader';
import Input from '../../../../components/atoms/Input';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import PlanSelector from '../../../../components/molecules/PlanSelector';
import { Plan } from '../../../../interfaces/property/PropertyInterface';
import { FormStepProps } from '../../../../interfaces/property/types';
import { getPlans } from '../../../../libs/owner/property/api-service';

export default function ScreenStep3({
  control,
  setValue,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
}: FormStepProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const { errors } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPress = async () => {
    try {
      setIsSubmitting(true);
      // Ejecutar onSubmit y esperar si devuelve una promesa
      const maybe = onSubmit();
      const res: any = await Promise.resolve(maybe);

      // Si onSubmit devuelve un objeto { success: boolean, message?: string }
      if (res && typeof res === 'object') {
        if ('success' in res && res.success === false) {
          Alert.alert('Hubo un problema', res.message || 'Error al crear la propiedad. Intenta de nuevo.');
          return;
        }
        // Si existe message con success true, podríamos mostrar un toast informativo (opcional)
      }
    } catch (err: any) {
      console.error('Error en onSubmit:', err);
      // Mostrar un mensaje amigable al usuario y permanecer en el formulario
      Alert.alert('Error', err?.message || 'Error al crear la propiedad. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingPlans(true);
        const res = await getPlans();
        if (!mounted) return;
        if (res && res.success) {
          setPlans(res.data || []);
          // set default id_plan to first plan if available
          if (res.data && res.data.length > 0) {
            setValue('id_plan' as any, res.data[0].id as any);
          }
        } else {
          console.warn('getPlans failed', res?.message);
        }
      } catch (err) {
        console.error('Error loading plans', err);
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [setValue]);

  return (
    <View className="flex-1 bg-white-traffic mt-10">
      <ScrollView 
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <ProgressBar
          steps={[
            { icon: 'home-outline', title: 'General', description: 'Información básica' },
            { icon: 'business-outline', title: 'Detalles', description: 'Características' },
            { icon: 'image-outline', title: 'Imágenes', description: 'Sube fotos' },
          ]}
          currentStep={3}
        />
        <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 3</Text>
      <Controller
        name="price"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Precio de renta"
            placeholder="Precio de renta"
            value={value?.toString() || ''}
            onChangeText={text => onChange(Number(text) || 0)}
            error={errors.price?.message}
            keyboardType="numeric"
            borderColor="#A346E6"
            backgroundColor="#F6F6F6"
            labelColor="#A346E6"
            textColor="#1F1F1F"
          />
        )}
      />
      <Text className="mb-2 font-semibold">Tipo de plan</Text>
      {loadingPlans ? (
        <Text className="text-sm text-gray-500">Cargando planes...</Text>
      ) : (
        <PlanSelector plans={plans} control={control} name="id_plan" />
      )}
      <Text className="mb-2 font-semibold">Imágenes de la propiedad</Text>
      <Text className="text-sm text-gray-600 mb-3">
        Sube hasta 10 fotos de tu propiedad. Las imágenes ayudan a atraer más inquilinos.
      </Text>
      
      <Controller
        name="images"
        control={control}
        render={({ field: { onChange, value = [] } }) => {
          const handleImageSelect = (selectedImages: ImagePicker.ImagePickerAsset[]) => {
            // Convertir ImagePickerAsset[] a PropertyImage[] y agregar a las imágenes existentes
            const newImages = selectedImages.map(image => ({ url_image: image.uri }));
            const allImages = [...value, ...newImages];
            onChange(allImages);
          };

          const removeImage = (index: number) => {
            const filteredImages = value.filter((_: any, i: number) => i !== index);
            onChange(filteredImages);
          };

          return (
            <>
              <ImageUploader 
                maxImages={10 - value.length} // Límite dinámico basado en imágenes ya seleccionadas
                source="both"
                aspectRatio={[4, 3]}
                quality={0.8}
                allowsEditing={true}
                title={value.length === 0 ? "Subir fotos de la propiedad" : `Agregar más fotos (${value.length}/10)`}
                className="mb-4"
                disabled={value.length >= 10}
                onImageSelect={handleImageSelect}
              />

              {/* Mostrar error de validación para imágenes */}
              {errors.images && (
                <Text className="text-red-500 text-sm mb-2">
                  {errors.images.message}
                </Text>
              )}

              {/* Vista previa de imágenes seleccionadas */}
              {value.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Fotos seleccionadas ({value.length}/10):
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {value.map((image: any, idx: number) => (
                      <View key={idx} className="relative">
                        <Image 
                          source={{ uri: image.url_image }} 
                          className="w-20 h-20 rounded-lg border-2 border-gray-200" 
                          resizeMode="cover"
                        />
                        {/* Número de imagen */}
                        <View className="absolute -top-1 -left-1 bg-lavender-indigo w-5 h-5 rounded-full items-center justify-center">
                          <Text className="text-white-traffic text-xs font-bold">{idx + 1}</Text>
                        </View>
                        {/* Botón eliminar */}
                        <Pressable 
                          className="absolute -top-1 -right-1 bg-erie-black w-5 h-5 rounded-full items-center justify-center"
                          onPress={() => removeImage(idx)}
                        >
                          <Text className="text-white-traffic text-xs font-bold">×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          );
        }}
      />
      </ScrollView>
      
      {/* Botones fijos en la parte inferior */}
      <View className="p-4 bg-white-traffic">
        <View className="flex-row justify-between">
          <View className="flex-1 mr-2">
            <ButtonAtom
              title="Atrás"
              onPress={prevStep}
              variant="secondary"
              size="large"
              icon="arrow-back-outline"
              iconPosition="left"
              fullWidth={true}
            />
          </View>
          <View className="flex-1 ml-2">
            <ButtonAtom
              title={isLastStep ? 'Guardar' : 'Siguiente'}
              onPress={handleSubmitPress}
              loading={isSubmitting}
              disabled={isSubmitting}
              variant={isLastStep ? 'success' : 'primary'}
              size="large"
              icon={isLastStep ? 'save-outline' : 'arrow-forward-outline'}
              iconPosition={isLastStep ? 'left' : 'right'}
              fullWidth={true}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
