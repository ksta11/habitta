import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Input from '../../../../components/atoms/Input';
import { useForm } from 'react-hook-form';

const plans = [
  { name: 'Básico', price: '$500' },
  { name: 'Estándar', price: '$1000' },
  { name: 'Premium', price: '$1500' },
  { name: 'Elite', price: '$2000' },
];
export default function CreatePropertyStep3() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(plans[0].name);
  const { register, setValue, watch, formState: { errors } } = useForm({});

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Nueva Propiedad - Paso 3</Text>
      <Input
        label="Precio de renta"
        placeholder="Precio de renta"
        value={watch('price')}
        onChangeText={text => setValue('price', text)}
        error={typeof errors.price?.message === 'string' ? errors.price?.message : undefined}
        keyboardType="numeric"
        {...register('price')}
      />
      <Text className="mb-2 font-semibold">Tipo de plan</Text>
      <View className="border rounded-lg mb-4 bg-white">
        <Picker
          selectedValue={selectedPlan}
          onValueChange={(itemValue) => setSelectedPlan(itemValue)}
        >
          {plans.map((plan) => (
            <Picker.Item
              key={plan.name}
              label={`${plan.name} - ${plan.price}`}
              value={plan.name}
            />
          ))}
        </Picker>
      </View>
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-300 rounded-lg p-3 flex-1 mr-2"
          onPress={() => router.back()}
        >
          <Text className="text-center text-gray-700 font-bold">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 rounded-lg p-3 flex-1 ml-2"
          onPress={() => {/* Aquí irá la lógica de guardar */}}
        >
          <Text className="text-center text-white font-bold">Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}