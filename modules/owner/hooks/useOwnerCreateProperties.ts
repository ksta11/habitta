import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { CreatePropertyDTO, Plan } from '../../../interfaces/property/PropertyInterface';
import { createProperty, getPlans } from '../../../libs/owner/property/api-service';

interface UseOwnerCreatePropertiesReturn {
  plans: Plan[];
  loadingPlans: boolean;
  loadPlans: () => Promise<void>;
  isSubmitting: boolean;
  submitProperty: (propertyData: CreatePropertyDTO) => Promise<any>;
}

export const useOwnerCreateProperties = (): UseOwnerCreatePropertiesReturn => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await getPlans();
      if (res && res.success) {
        setPlans(res.data || []);
      } else {
        console.warn('getPlans failed', res?.message);
        Alert.alert('Error', res?.message || 'No se pudieron cargar los planes');
      }
    } catch (err: any) {
      console.error('Error loading plans', err);
      Alert.alert('Error', err?.message || 'Error al cargar planes');
    } finally {
      setLoadingPlans(false);
    }
  };

  const submitProperty = async (propertyData: CreatePropertyDTO) => {
    try {
      setIsSubmitting(true);
      const result = await createProperty(propertyData);
      return result;
    } catch (err: any) {
      console.error('Error submitting property', err);
      return { success: false, message: err?.message || 'Error inesperado' };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Cargar planes al montar
    loadPlans();
  }, []);

  return {
    plans,
    loadingPlans,
    loadPlans,
    isSubmitting,
    submitProperty,
  };
};

export default useOwnerCreateProperties;
