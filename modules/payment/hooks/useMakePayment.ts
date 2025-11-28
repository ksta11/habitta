import { useEffect, useState } from 'react';
import { Payment } from '../../../interfaces/PaymentInterface';
import { createPaymentIntent } from '../../../libs/payment/api-service';

/**
 * Hook para solicitar al backend la creación de un PaymentIntent y obtener el client_secret.
 * IMPORTANT: el backend espera el id interno del pago ("id_pay"), no el id de Stripe.
 *
 * @param idPay id interno del pago (id_pay). Si es null, el hook no hace la petición.
 */
export default function useMakePayment(idPay: string | null) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idPay) {
      setClientSecret(null);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Llamamos al api-service pasando el id interno (id_pay)
        const res = await createPaymentIntent(idPay as string);
        if (!mounted) return;
        if (res.success) {
          setClientSecret(res.data.client_secret);
          setPayment(res.data.payment ?? null);
        } else {
          setError(res.message || 'Error creando PaymentIntent');
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Error inesperado');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [idPay]);

  return { clientSecret, payment, loading, error };
}