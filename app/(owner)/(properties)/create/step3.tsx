
const plans = [
  { name: 'Básico', price: '$500' },
  { name: 'Estándar', price: '$1000' },
  { name: 'Premium', price: '$1500' },
  { name: 'Elite', price: '$2000' },
];

import React from 'react';
import { View, Text, TouchableOpacity, Image, Button } from 'react-native';
import Input from '../../../../components/atoms/Input';
import * as ImagePicker from 'expo-image-picker';
import ProgressBar from '../../../../components/atoms/ProgressBar';
import PickerAtom from '../../../../components/atoms/Picker';

export default function Step3({
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
  const [selectedPlan, setSelectedPlan] = React.useState(plans[0].name);
  // Sincronizar imágenes con el formulario global
  const images = watch('images') || [];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });
    if (!result.canceled) {
      setValue('images', [...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setValue('images', images.filter((_: any, i: number) => i !== index));
  };

  return (
    <View className="flex-1 bg-white p-4">
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
        value={watch('price')}
        onChangeText={text => setValue('price', Number(text))}
        error={errors.price?.message}
        keyboardType="numeric"
        {...register('price')}
      />
      <Text className="mb-2 font-semibold">Tipo de plan</Text>
      <PickerAtom
        label=""
        value={selectedPlan}
        onValueChange={value => {
          setSelectedPlan(value);
          setValue('plan', value);
        }}
        options={plans.map(plan => ({ label: `${plan.name} (${plan.price})`, value: plan.name }))}
        error={errors.plan?.message}
      />
      <Text className="mb-2 font-semibold">Imágenes de la propiedad</Text>
      <Button title="Agregar imagen" onPress={pickImage} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
        {images.map((uri: string, idx: number) => (
          <View key={idx} style={{ marginRight: 10, alignItems: 'center' }}>
            <Image source={{ uri }} style={{ width: 60, height: 60, borderRadius: 8 }} />
            <TouchableOpacity onPress={() => removeImage(idx)}>
              <Text style={{ color: 'red', textAlign: 'center', fontSize: 12 }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          className="bg-gray-300 rounded-lg p-3 flex-1 mr-2"
          onPress={prevStep}
          disabled={isFirstStep}
        >
          <Text className="text-center text-gray-700 font-bold">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 rounded-lg p-3 flex-1 ml-2"
          onPress={isLastStep ? onSubmit : nextStep}
        >
          <Text className="text-center text-white font-bold">{isLastStep ? 'Guardar' : 'Siguiente'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}