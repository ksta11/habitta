import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../../../../components/atoms/InputForm';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const propertySchema = z.object({
  title: z.string().min(3, 'El título es requerido'),
  description: z.string().min(5, 'La descripción es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  address: z.string().min(5, 'La dirección es requerida'),
});

type PropertyForm = z.infer<typeof propertySchema>;

export default function CreatePropertyStep1() {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = (data: PropertyForm) => {
    // Aquí podrías guardar en contexto o navegar pasando datos
    router.push('/(owner)/properties/create/step2');
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Nueva Propiedad - Paso 1</Text>
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
          onPress={() => router.back()}  // Cambiado para ir al paso anterior
        >
          <Text className="text-center text-gray-700 font-bold">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-3 flex-1 ml-2"
          onPress={() => router.push('/(owner)/properties/create/step2')} // Navega al siguiente paso
        >
          <Text className="text-center text-white font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
