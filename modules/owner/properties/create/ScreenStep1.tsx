import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import Input from '../../../../components/atoms/Input';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep1({
  control,
  formState,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  onSubmit,
  onStepPress,
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
        currentStep={1}
        onStepPress={onStepPress}
      />
      <Text className="text-2xl font-bold my-4">Nueva Propiedad - Paso 1</Text>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Título"
            placeholder="Título"
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
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Descripción"
            placeholder="Descripción"
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
      <Controller
        name="city"
        control={control}
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
      <Controller
        name="address"
        control={control}
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

      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <ButtonAtom
            title={isFirstStep ? 'Cancelar' : 'Atrás'}
            onPress={prevStep}
            variant="secondary"
            size="large"
            icon={isFirstStep ? 'close-outline' : 'arrow-back-outline'}
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

