import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep2({
  control,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
}: FormStepProps) {
  const { errors } = formState;
  return (
    <View className="flex-1 bg-white-traffic p-4 mt-10">
      <ProgressBar
        steps={[
          { icon: 'home-outline', title: 'General', description: 'Información básica' },
          { icon: 'business-outline', title: 'Detalles', description: 'Características' },
          { icon: 'image-outline', title: 'Imágenes', description: 'Sube fotos' },
        ]}
        currentStep={2}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 2</Text>
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <PickerAtom
            label="Tipo de propiedad"
            value={value}
            onValueChange={onChange}
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
        )}
      />
      <Controller
        name="area"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Área"
            placeholder="Área (m²)"
            value={value?.toString() || ''}
            onChangeText={text => onChange(Number(text) || 0)}
            error={errors.area?.message}
            keyboardType="numeric"
            borderColor="#A346E6"
            backgroundColor="#F6F6F6"
            labelColor="#A346E6"
            textColor="#1F1F1F"
          />
        )}
      />
      <Controller
        name="rooms"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Habitaciones"
            placeholder="Habitaciones"
            value={value?.toString() || ''}
            onChangeText={text => onChange(Number(text) || 0)}
            error={errors.rooms?.message}
            keyboardType="numeric"
            borderColor="#A346E6"
            backgroundColor="#F6F6F6"
            labelColor="#A346E6"
            textColor="#1F1F1F"
          />
        )}
      />
      <Controller
        name="bathrooms"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Baños"
            placeholder="Baños"
            value={value?.toString() || ''}
            onChangeText={text => onChange(Number(text) || 0)}
            error={errors.bathrooms?.message}
            keyboardType="numeric"
            borderColor="#A346E6"
            backgroundColor="#F6F6F6"
            labelColor="#A346E6"
            textColor="#1F1F1F"
          />
        )}
      />
      <Controller
        name="services"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Servicios"
            placeholder="Servicios (ej: agua, luz, internet)"
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
            onPress={onSubmit}
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

