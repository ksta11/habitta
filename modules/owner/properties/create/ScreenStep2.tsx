import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep2({
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
        currentStep={2}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 2</Text>
      <PickerAtom
        label="Tipo de propiedad"
        value={watch('type')}
        onValueChange={value => setValue('type', value as 'house' | 'apartament' | 'store' | 'office' | 'werehouse')}
        options={[
          { label: 'Selecciona un tipo', value: '' },
          { label: 'Casa', value: 'house' },
          { label: 'Apartamento', value: 'apartament' },
          { label: 'Tienda', value: 'store' },
          { label: 'Oficina', value: 'office' },
          { label: 'Bodega', value: 'werehouse' },
        ]}
        error={errors.type?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
      />
      <Input
        label="Área"
        placeholder="Área (m²)"
        value={watch('area')?.toString() || ''}
        onChangeText={text => setValue('area', Number(text))}
        error={errors.area?.message}
        keyboardType="numeric"
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('area')}
      />
      <Input
        label="Habitaciones"
        placeholder="Habitaciones"
        value={watch('rooms')?.toString() || ''}
        onChangeText={text => setValue('rooms', Number(text))}
        error={errors.rooms?.message}
        keyboardType="numeric"
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('rooms')}
      />
      <Input
        label="Baños"
        placeholder="Baños"
        value={watch('bathrooms')?.toString() || ''}
        onChangeText={text => setValue('bathrooms', Number(text))}
        error={errors.bathrooms?.message}
        keyboardType="numeric"
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('bathrooms')}
      />
      <Input
        label="Servicios"
        placeholder="Servicios (ej: agua, luz, internet)"
        value={watch('services')}
        onChangeText={text => setValue('services', text)}
        error={errors.services?.message}
        borderColor="#A346E6"
        backgroundColor="#F6F6F6"
        labelColor="#A346E6"
        textColor="#1F1F1F"
        {...register('services')}
      />
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
            title="Siguiente"
            onPress={nextStep}
            variant="primary"
            size="large"
            icon="arrow-forward-outline"
            iconPosition="right"
            fullWidth={true}
          />
        </View>
      </View>
    </View>
  );
}

