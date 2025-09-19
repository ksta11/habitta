import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../../../components/atoms/Input';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep1({
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
  return (
    <View className="flex-1 bg-white-traffic p-4">
      <ProgressBar
        steps={[
          { icon: 'home-outline', title: 'General', description: 'Información básica' },
          { icon: 'business-outline', title: 'Detalles', description: 'Características' },
          { icon: 'image-outline', title: 'Imágenes', description: 'Sube fotos' },
        ]}
        currentStep={1}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 1</Text>
      <Input
        label="Título"
        placeholder="Título"
        value={watch('title')}
        onChangeText={text => setValue('title', text)}
        error={errors.title?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('title')}
      />
      <Input
        label="Descripción"
        placeholder="Descripción"
        value={watch('description')}
        onChangeText={text => setValue('description', text)}
        error={errors.description?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('description')}
      />
      <Input
        label="Ciudad"
        placeholder="Ciudad"
        value={watch('city')}
        onChangeText={text => setValue('city', text)}
        error={errors.city?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('city')}
      />
      <Input
        label="Dirección"
        placeholder="Dirección"
        value={watch('address')}
        onChangeText={text => setValue('address', text)}
        error={errors.address?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('address')}
      />

      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-erie-black rounded-lg p-3 flex-1 mr-2"
          onPress={prevStep}
        >
          <Text className="text-center text-white-traffic font-bold">
            {isFirstStep ? 'Cancelar' : 'Atrás'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-lavender-indigo rounded-lg p-3 flex-1 ml-2"
          onPress={nextStep}
        >
          <Text className="text-center text-white-traffic font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
