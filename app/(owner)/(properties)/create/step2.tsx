import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';

export default function Step2({
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
        currentStep={2}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 2</Text>
      <PickerAtom
        label="Tipo de propiedad"
        value={watch('type')}
        onValueChange={value => setValue('type', value)}
        options={[
          { label: 'Selecciona un tipo', value: '' },
          { label: 'Casa', value: 'house' },
          { label: 'Apartamento', value: 'apartament' },
          { label: 'Tienda', value: 'store' },
          { label: 'Oficina', value: 'office' },
          { label: 'Bodega', value: 'werehouse' },
        ]}
        error={errors.type?.message}
      />
      <Input
        label="Área"
        placeholder="Área (m²)"
        value={watch('area')}
        onChangeText={text => setValue('area', Number(text))}
        error={errors.area?.message}
        keyboardType="numeric"
        {...register('area')}
      />
      <Input
        label="Habitaciones"
        placeholder="Habitaciones"
        value={watch('rooms')}
        onChangeText={text => setValue('rooms', Number(text))}
        error={errors.rooms?.message}
        keyboardType="numeric"
        {...register('rooms')}
      />
      <Input
        label="Baños"
        placeholder="Baños"
        value={watch('bathrooms')}
        onChangeText={text => setValue('bathrooms', Number(text))}
        error={errors.bathrooms?.message}
        keyboardType="numeric"
        {...register('bathrooms')}
      />
      <Input
        label="Servicios"
        placeholder="Servicios (ej: agua, luz, internet)"
        value={watch('services')}
        onChangeText={text => setValue('services', text)}
        error={errors.services?.message}
        {...register('services')}
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
