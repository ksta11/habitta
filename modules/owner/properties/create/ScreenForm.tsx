import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropertySchema } from '../../../../schemes/PropertySchema';
import { CreatePropertyDTO } from '../../../../interfaces/property/PropertyInterface';
import ScreenStep1 from './ScreenStep1';
import ScreenStep2 from './ScreenStep2';
import ScreenStep3 from './ScreenStep3';
import { createProperty } from '../../../../libs/owner/property/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'expo-router';

const steps = [ScreenStep1, ScreenStep2, ScreenStep3];

// Campos por step
type FieldName =
  | 'title'
  | 'description'
  | 'address'
  | 'city'
  | 'type'
  | 'area'
  | 'rooms'
  | 'bathrooms'
  | 'services'
  | 'price'
  | 'images';

const stepFields: FieldName[][] = [
  ['title', 'description', 'address', 'city'], // Step 1
  ['type', 'area', 'rooms', 'bathrooms', 'services'], // Step 2
  ['price', 'images'], // Step 3
];

export default function ScreenForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const form = useForm<CreatePropertyDTO>({
    resolver: zodResolver(PropertySchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      price: 0,
      area: 0,
      rooms: 0,
      bathrooms: 0,
      type: '',
      services: '',
      images: [],
    },
  });

  const StepComponent = steps[currentStep];

  const nextStep = async () => {
    const fields: FieldName[] = stepFields[currentStep];
    const valid = await form.trigger(fields);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Lógica para enviar el formulario
  const router = useRouter();
  
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const propertyData = { ...data, id_owner: user?.id };
      const result = await createProperty(propertyData);
      if (result.success) {
        console.log('✅ Propiedad creada exitosamente:', result.data);
        // Limpiar formulario
        form.reset();
        // Redirigir de vuelta a la lista de propiedades
        router.back();
      } else {
        // Mostrar error
        console.log('❌ Error al crear propiedad:', result.message);
      }
    } catch (error) {
      console.log('💥 Error inesperado:', error);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <StepComponent
        {...form}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={onSubmit}
        isLastStep={currentStep === steps.length - 1}
        isFirstStep={currentStep === 0}
      />
    </View>
  );
}
