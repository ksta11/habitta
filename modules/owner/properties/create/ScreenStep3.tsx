
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import ImageUploader from '../../../../components/atoms/ImageUploader';
import NumericField from '../../../../components/atoms/NumericField';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import PlanSelector from '../../../../components/molecules/PlanSelector';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep3({
  control,
  setValue,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
  onStepPress,
  // optional props injected from create hook via parent
  plans = [],
  loadingPlans = false,
  loadPlans,
  isSubmitting = false,
}: FormStepProps) {
  const router = useRouter();
  const { errors } = formState;

  // Price input uses the reusable NumericField component (float mode)

  // Si el padre pasa planes, establecer el plan por defecto al primero
  useEffect(() => {
    if (plans && plans.length > 0) {
      setValue('id_plan' as any, plans[0].id as any);
    }
  }, [plans, setValue]);

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
          onStepPress={onStepPress}
        />
        <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 3</Text>
      <Controller
        name="price"
        control={control}
        render={({ field: { onChange, value } }) => (
          <NumericField
            label="Precio de renta"
            placeholder="Precio de renta"
            value={value}
            onChange={onChange}
            error={errors.price?.message}
            integer={false}
            borderColor="#A346E6"
            backgroundColor="#F6F6F6"
            labelColor="#A346E6"
            textColor="#1F1F1F"
          />
        )}
      />
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-semibold">Tipo de plan</Text>
        <Pressable
          onPress={() => router.push('/(owner)/(properties)/plans' as any)}
          className="flex-row items-center"
        >
          <Text className="text-sm text-violet font-semibold mr-1">Ver detalles de planes</Text>
          <Text className="text-violet">→</Text>
        </Pressable>
      </View>
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
              onPress={onSubmit}
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
