import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../../../components/atoms/Input';
import ProgressBar from '../../../../components/atoms/ProgressBar';

export default function Step1({
  register,
  setValue,
  watch,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
}: any) {
  const { errors } = formState;
  return (
    <View className="flex-1 bg-white p-4">
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
        {...register('title')}
      />
      <Input
        label="Descripción"
        placeholder="Descripción"
        value={watch('description')}
        onChangeText={text => setValue('description', text)}
        error={errors.description?.message}
        {...register('description')}
      />
      <Input
        label="Ciudad"
        placeholder="Ciudad"
        value={watch('city')}
        onChangeText={text => setValue('city', text)}
        error={errors.city?.message}
        {...register('city')}
      />
      <Input
        label="Dirección"
        placeholder="Dirección"
        value={watch('address')}
        onChangeText={text => setValue('address', text)}
        error={errors.address?.message}
        {...register('address')}
      />

      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-300 rounded-lg p-3 flex-1 mr-2"
          onPress={prevStep}
          disabled={isFirstStep}
        >
          <Text className="text-center text-gray-700 font-bold">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-3 flex-1 ml-2"
          onPress={nextStep}
        >
          <Text className="text-center text-white font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
