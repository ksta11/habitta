import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getUserPayments } from '../../../libs/payment/api-service';

export default function useViewPayment() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserPayments();
      if (res && res.success) {
        setPayments(res.data || []);
      } else {
        setPayments([]);
        setError(res?.message || 'No se pudieron cargar los pagos');
        Alert.alert('Error', res?.message || 'No se pudieron cargar los pagos');
      }
    } catch (err: any) {
      console.error('Error loading payments', err);
      setError(err?.message || 'Error inesperado');
      setPayments([]);
      Alert.alert('Error', err?.message || 'Error inesperado al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // load once on mount
    loadPayments();
  }, [loadPayments]);

  return {
    payments,
    loading,
    error,
    reload: loadPayments,
  } as const;
}
