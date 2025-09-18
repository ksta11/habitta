
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Input from '../../../../components/atoms/Input';
import * as ImagePicker from 'expo-image-picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import PickerAtom from '../../../../components/atoms/Picker';
import ImageUploader from '../../../../components/atoms/ImageUploader';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import { FormStepProps } from '../../../../interfaces/property/types';

const plans = [
  { name: 'Básico', price: '$500' },
  { name: 'Estándar', price: '$1000' },
  { name: 'Premium', price: '$1500' },
  { name: 'Elite', price: '$2000' },
];

export default function ScreenStep3({
  register,
  setValue,
  watch,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
}: FormStepProps) {
  const { errors } = formState;
  const [selectedPlan, setSelectedPlan] = React.useState(plans[0].name);
  // Sincronizar imágenes con el formulario global
  const images = watch('images') || [];

  const handleImageSelect = (selectedImages: ImagePicker.ImagePickerAsset[]) => {
    // Convertir ImagePickerAsset[] a string[] (URIs) y agregar a las imágenes existentes
    const newImageUris = selectedImages.map(image => image.uri);
    const allImages = [...images, ...newImageUris];
    setValue('images', allImages);
  };

  const removeImage = (index: number) => {
    setValue('images', images.filter((_: any, i: number) => i !== index));
  };

  return (
    <View className="flex-1 bg-white-traffic p-4">
      <ProgressBar
        steps={[
          { icon: 'home-outline', title: 'General', description: 'Información básica' },
          { icon: 'business-outline', title: 'Detalles', description: 'Características' },
          { icon: 'image-outline', title: 'Imágenes', description: 'Sube fotos' },
        ]}
        currentStep={3}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 3</Text>
      <Input
        label="Precio de renta"
        placeholder="Precio de renta"
        value={watch('price')?.toString() || ''}
        onChangeText={text => setValue('price', Number(text))}
        error={errors.price?.message}
        keyboardType="numeric"
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('price')}
      />
      <Text className="mb-2 font-semibold">Tipo de plan</Text>
      <PickerAtom
        label=""
        value={selectedPlan}
        onValueChange={value => {
          setSelectedPlan(value);
          // Nota: El plan no se guarda en el formulario principal por ahora
        }}
        options={plans.map(plan => ({ label: `${plan.name} (${plan.price})`, value: plan.name }))}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
      />
      <Text className="mb-2 font-semibold">Imágenes de la propiedad</Text>
      <Text className="text-sm text-gray-600 mb-3">
        Sube hasta 10 fotos de tu propiedad. Las imágenes ayudan a atraer más inquilinos.
      </Text>
      
      <ImageUploader 
        maxImages={10 - images.length} // Límite dinámico basado en imágenes ya seleccionadas
        source="both"
        aspectRatio={[4, 3]}
        quality={0.8}
        allowsEditing={true}
        title={images.length === 0 ? "Subir fotos de la propiedad" : `Agregar más fotos (${images.length}/10)`}
        className="mb-4"
        disabled={images.length >= 10}
        onImageSelect={handleImageSelect}
      />

      {/* Vista previa de imágenes seleccionadas */}
      {images.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Fotos seleccionadas ({images.length}/10):
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {images.map((uri: string, idx: number) => (
              <View key={idx} className="relative">
                <Image 
                  source={{ uri }} 
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

      <View className="flex-row justify-between mt-6">
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
            onPress={isLastStep ? onSubmit : nextStep}
            variant={isLastStep ? 'success' : 'primary'}
            size="large"
            icon={isLastStep ? 'save-outline' : 'arrow-forward-outline'}
            iconPosition={isLastStep ? 'left' : 'right'}
            fullWidth={true}
          />
        </View>
      </View>
    </View>
  );
}
