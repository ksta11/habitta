import { Ionicons } from '@expo/vector-icons';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonAtom from '../../components/atoms/ButtonAtom';
import { formatCurrency } from '../../utils/format';
import useMakePayment from './hooks/useMakePayment';

interface MakePaymentProps {
  /** id interno del pago (id_pay) que espera el backend */
  idPay?: string | null;
  /** id del pago en Stripe (opcional, solo informativo) */
  stripePaymentId?: string | null;
}

export default function MakePayment({ idPay }: MakePaymentProps) {
  // El hook utiliza el id interno (id_pay). Si no está presente no hará la petición.
  const { clientSecret, payment, loading, error } = useMakePayment(idPay ?? null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [sheetReady, setSheetReady] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  // Inicializar PaymentSheet cuando tengamos clientSecret
  useEffect(() => {
    let mounted = true;
    async function prepare() {
      if (!clientSecret) return;
      try {
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Habitta',
          // Puedes pasar opciones como merchantCountryCode, applePay, googlePay, etc.
        });
        if (!mounted) return;
        if (initError) {
          console.error('Error inicializando PaymentSheet', initError);
          setSheetReady(false);
        } else {
          setSheetReady(true);
        }
      } catch (e) {
        console.error('Error preparando PaymentSheet', e);
        setSheetReady(false);
      }
    }
    prepare();
    return () => {
      mounted = false;
    };
  }, [clientSecret, initPaymentSheet]);

  const handlePayPress = async () => {
    if (!sheetReady || !clientSecret || !payment || !idPay) return;
    setPayLoading(true);
    try {
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert('Error', presentError.message || 'Error al procesar el pago');
        setPayLoading(false);
        return;
      }

      // PaymentSheet reports success locally. Final confirmation will arrive
      // via webhook (server-side). Inform the user and trust the webhook
      // to update the payment status in your backend.
      Alert.alert('Listo', 'Pago enviado. La confirmación final se registrará automáticamente (webhook).');
    } catch (e) {
      Alert.alert('Error', 'Ocurrió un error al procesar el pago');
    } finally {
      setPayLoading(false);
    }
  };

  // Antes usábamos 'showReceipt' para mostrar/ocultar el recibo; ahora mostramos
  // siempre la sección de recibo cuando exista el objeto `payment`.
  
  function formatDate(dateString?: string) {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  }

  const statusLabels: Record<string, string> = {
    completed: 'Completado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
    expired: 'Expirado',
    active: 'Activo',
    inactive: 'Inactivo',
    failed: 'Fallido',
    refunded: 'Devuelto',
    overdue: 'Vencido',
  };
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="habitta" // required for 3D Secure and bank redirects
    >
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#6D28D9" />
            <Text className="text-gray-500 mt-4 text-base">Preparando pago…</Text>
          </View>
        )}

        {error && (
          <View className="flex-1 p-6 justify-center">
            <View className="bg-red-50 p-6 rounded-2xl">
              <Text className="text-red-600 font-bold text-lg">Error</Text>
              <Text className="text-red-600 mt-2">{error}</Text>
            </View>
          </View>
        )}

        {!loading && clientSecret && payment && (
          <View className="flex-1 p-4">
            <LinearGradient
              colors={["#4C1D95", "#6D28D9", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 28,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
              >
                <View>
                  {/* Header con icono y monto */}
                  <View className="items-center mb-8">
                    <View className="bg-white/20 p-4 rounded-full mb-4">
                      <Ionicons name="card-outline" size={40} color="#fff" />
                    </View>
                    <Text className="text-white/90 text-base mb-2">Monto a pagar</Text>
                    <Text className="text-5xl font-extrabold text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </Text>
                  </View>

                  {/* Concepto prominente */}
                  <View className="mb-6">
                    <Text className="text-white/80 text-sm mb-2">Concepto</Text>
                    <Text className="text-2xl font-bold text-white leading-tight">
                      {payment.concept}
                    </Text>
                  </View>

                  {/* Estado con badge grande */}
                  <View className="mb-6 items-center">
                    <View style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 24,
                      backgroundColor: payment.status === 'paid' 
                        ? 'rgba(16, 185, 129, 0.25)' 
                        : payment.status === 'pending' 
                        ? 'rgba(251, 191, 36, 0.25)' 
                        : 'rgba(239, 68, 68, 0.25)',
                    }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: payment.status === 'paid' 
                          ? '#D1FAE5' 
                          : payment.status === 'pending' 
                          ? '#FEF3C7' 
                          : '#FEE2E2',
                      }}>
                        {payment.status ? (statusLabels[payment.status] ?? payment.status) : 'Desconocido'}
                      </Text>
                    </View>
                  </View>

                  {/* Información en tarjetas */}
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 20, padding: 16, marginBottom: 16 }}>
                    {payment.method && (
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="wallet-outline" size={20} color="#fff" />
                        <Text className="text-white ml-3 text-base flex-1">
                          <Text className="text-white/80">Método: </Text>
                          <Text className="font-semibold">{payment.method}</Text>
                        </Text>
                      </View>
                    )}
                    
                    {payment.payment_date && (
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text className="text-white/90 text-sm ml-3">
                          Pagado: {formatDate(payment.payment_date)}
                        </Text>
                      </View>
                    )}
                    
                    {payment.due_date && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={20} color="#fff" />
                        <Text className="text-white/90 text-sm ml-3">
                          Vencimiento: {formatDate(payment.due_date)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Detalles adicionales */}
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 16 }}>
                    {payment.reference_code && (
                      <View className="mb-4">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-white/80 text-sm">Referencia</Text>
                          <ButtonAtom 
                            title="Copiar" 
                            onPress={async () => { 
                              if (!payment.reference_code) {
                                Alert.alert('Error', 'No hay referencia para copiar');
                                return;
                              }
                              await Clipboard.setStringAsync(payment.reference_code);
                              Alert.alert('✓ Copiado', 'Referencia copiada'); 
                            }} 
                            variant="habitta-outline" 
                            size="small" 
                          />
                        </View>
                        <Text className="text-white font-mono font-semibold text-base">
                          {payment.reference_code}
                        </Text>
                      </View>
                    )}

                    {payment.id_pay && (
                      <View className="mb-4">
                        <Text className="text-white/70 text-xs mb-1">ID interno</Text>
                        <Text className="text-white/90 font-mono text-sm">{payment.id_pay}</Text>
                      </View>
                    )}

                    {payment.created_at && (
                      <View>
                        <Text className="text-white/70 text-xs mb-1">Creado</Text>
                        <Text className="text-white/90 text-sm">{formatDate(payment.created_at)}</Text>
                      </View>
                    )}
                  </View>

                  {(payment.description || payment.notes) && (
                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 16, marginTop: 16 }}>
                      {payment.description && (
                        <Text className="text-white text-sm leading-6 mb-2">
                          {payment.description}
                        </Text>
                      )}
                      {payment.notes && (
                        <Text className="text-white/70 text-sm italic">
                          {payment.notes}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Botón de pago fijo al fondo */}
                <View className="mt-8 pt-6" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <ButtonAtom
                    title={payLoading ? 'Procesando...' : 'Pagar ahora'}
                    onPress={handlePayPress}
                    variant="habitta-primary"
                    fullWidth
                    loading={payLoading}
                    disabled={!sheetReady || payLoading}
                    icon="card-outline"
                    size="large"
                  />
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        )}

        {!loading && !clientSecret && !error && (
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator size="large" color="#6D28D9" />
            <Text className="text-gray-600 mt-4 text-center text-base">
              Preparando la sesión de pago...
            </Text>
            <Text className="text-gray-500 mt-2 text-center text-sm">
              Si tarda demasiado, intenta nuevamente
            </Text>
          </View>
        )}
      </SafeAreaView>
    </StripeProvider>
  );
}