import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import NumericField from '../../../../components/atoms/NumericField';
import PickerAtom from '../../../../components/atoms/Picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import ServicesSelector from '../../../../components/molecules/ServicesSelector';
import { FormStepProps } from '../../../../interfaces/property/types';

export default function ScreenStep2({
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
        currentStep={2}
        onStepPress={onStepPress}
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
          <NumericField
            label="Área"
            placeholder="Área (m²)"
            value={value}
            onChange={onChange}
            error={errors.area?.message}
            integer={false}
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
          <NumericField
            label="Habitaciones"
            placeholder="Habitaciones"
            value={value}
            onChange={onChange}
            error={errors.rooms?.message}
            integer={true}
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
          <NumericField
            label="Baños"
            placeholder="Baños"
            value={value}
            onChange={onChange}
            error={errors.bathrooms?.message}
            integer={true}
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
          <ServicesSelector
            value={value}
            onChange={onChange}
            error={errors.services?.message}
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

