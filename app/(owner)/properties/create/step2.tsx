import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../../../components/atoms/Input';
import { useForm } from 'react-hook-form';

export default function CreatePropertyStep2() {
  const router = useRouter();
  const { register, setValue, watch, formState: { errors } } = useForm({});

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Nueva Propiedad - Paso 2</Text>
      <Input
        label="Tipo"
        placeholder="Tipo de propiedad"
        value={watch('type')}
        onChangeText={text => setValue('type', text)}
        error={typeof errors.type?.message === 'string' ? errors.type?.message : undefined}
        {...register('type')}
      />
      <Input
        label="Área"
        placeholder="Área (m²)"
        value={watch('area')}
        onChangeText={text => setValue('area', text)}
        error={typeof errors.area?.message === 'string' ? errors.area?.message : undefined}
        keyboardType="numeric"
        {...register('area')}
      />
      <Input
        label="Habitaciones"
        placeholder="Habitaciones"
        value={watch('rooms')}
        onChangeText={text => setValue('rooms', text)}
        error={typeof errors.rooms?.message === 'string' ? errors.rooms?.message : undefined}
        keyboardType="numeric"
        {...register('rooms')}
      />
      <Input
        label="Baños"
        placeholder="Baños"
        value={watch('bathrooms')}
        onChangeText={text => setValue('bathrooms', text)}
        error={typeof errors.bathrooms?.message === 'string' ? errors.bathrooms?.message : undefined}
        keyboardType="numeric"
        {...register('bathrooms')}
      />
      <Input
        label="Servicios"
        placeholder="Servicios (ej: agua, luz, internet)"
        value={watch('services')}
        onChangeText={text => setValue('services', text)}
        error={typeof errors.services?.message === 'string' ? errors.services?.message : undefined}
        {...register('services')}
      />
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-300 rounded-lg p-3 flex-1 mr-2"
          onPress={() => router.back()}
        >
          <Text className="text-center text-gray-700 font-bold">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-3 flex-1 ml-2"
          onPress={() => router.push('/(owner)/properties/create/step3')}
        >
          <Text className="text-center text-white font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
