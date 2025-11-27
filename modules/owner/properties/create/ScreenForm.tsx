import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import AlertModal from '../../../../components/atoms/AlertModal';
import { useAuth } from '../../../../contexts/AuthContext';
import { CreatePropertyFormType, CreatePropertySchema } from '../../../../schemes/PropertySchema';
import useOwnerCreateProperties from '../../hooks/useOwnerCreateProperties';
import ScreenStep1 from './ScreenStep1';
import ScreenStep2 from './ScreenStep2';
import ScreenStep3 from './ScreenStep3';

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);
  const form = useForm<CreatePropertyFormType>({
    resolver: zodResolver(CreatePropertySchema),
    mode: 'onChange', // Solo valida al hacer submit
    reValidateMode: 'onChange', // Revalida en blur después del primer submit
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      price: 0,
      area: 0,
      rooms: 0,
      bathrooms: 0,
      type: "house",
      services: '',
      images: [],
    },
  });

  const StepComponent = steps[currentStep];

  // Lógica para enviar el formulario
  const router = useRouter();

  // Función para validar step y avanzar
  const handleStepSubmit = async () => {
    console.log(`🔍 Validando step ${currentStep + 1}...`);
    
    // Si es el último step, enviar el formulario completo
    if (currentStep === steps.length - 1) {
      console.log('📤 Último step, enviando formulario...');
      // Para el último step, validar todo el formulario y enviar
      const isValid = await form.trigger();
      if (isValid) {
        const data = form.getValues();
        const result = await submitForm(data);
        return result;
      } else {
        console.log('❌ Formulario completo tiene errores:', form.formState.errors);
      }
    } else {
      // Si no es el último step, validar solo campos del step actual
      const fields: FieldName[] = stepFields[currentStep];
      console.log('🔍 Validando campos:', fields);
      
      const valid = await form.trigger(fields);
      
      if (valid) {
        console.log(`✅ Step ${currentStep + 1} válido, avanzando...`);
        setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      } else {
        console.log(`❌ Step ${currentStep + 1} tiene errores:`, form.formState.errors);
      }
    }
  };

  // Hook compartido para creación (planes + submit)
  const createHooks = useOwnerCreateProperties();

  // Lógica para enviar el formulario completo
  const submitForm = async (data: CreatePropertyFormType) => {
    const propertyData = { ...data, id_owner: user?.id };
    const result = await createHooks.submitProperty(propertyData as any);
    if (result && result.success) {
      // Si todo ok, navegar
      setTimeout(() => router.replace('../'), 300);
    } else {
      console.log('❌ Error al crear propiedad:', result?.message);
      setAlertData({ type: 'error', title: 'Error', message: result?.message || 'No se pudo crear la propiedad' });
      setAlertVisible(true);
    }
    return result;
  };
  
  const prevStep = () => {
    if (currentStep === 0) {
      // Si estamos en el primer step, resetear formulario y volver a la pantalla anterior
      form.reset();
      router.back();
    } else {
      // Si no, ir al step anterior
      setCurrentStep((s) => Math.max(s - 1, 0));
    }
  };

  // Función para ir a un step específico (solo hacia atrás)
  const goToStep = (stepNumber: number) => {
    const stepIndex = stepNumber - 1; // Convertir de 1-based a 0-based
    if (stepIndex < currentStep && stepIndex >= 0) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StepComponent
        {...form}
        nextStep={() => {}} // Ya no se usa directamente
        prevStep={prevStep}
        onSubmit={handleStepSubmit}
        isLastStep={currentStep === steps.length - 1}
        isFirstStep={currentStep === 0}
        onStepPress={goToStep}
        // Props from create hook
        plans={createHooks.plans}
        loadingPlans={createHooks.loadingPlans}
        loadPlans={createHooks.loadPlans}
        isSubmitting={createHooks.isSubmitting}
      />

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
