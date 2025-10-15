import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { resendConfirmation } from '../../../libs/auth/verify/api-service';
import { KeyboardAvoidingView, Platform, Pressable, StatusBar as RNStatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthInput from '../../../components/atoms/AuthInput';
import ModernButton from '../../../components/atoms/ModernButton';

interface RouteParams {
  userId?: string;
  id?: string;
}

interface ScreenVerifyProps {
  userId?: string;
}

export default function ScreenVerify({ userId: propUserId }: ScreenVerifyProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams() as RouteParams;
  const userId = propUserId ?? params?.userId ?? null;
  const auth = useAuth();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // resend cooldown in seconds
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
    }
    // start initial cooldown so user cannot spam resend immediately
    setSecondsLeft(60);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // start interval if not already running
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
    }

    return () => {
      // keep interval running until secondsLeft reaches 0; cleanup handled above
    };
  }, [secondsLeft]);

  const onVerify = async () => {
    setError(null);
    if (!code || code.trim().length === 0) {
      setError('Ingresa el código de verificación');
      return;
    }

    // Aquí se llamará el endpoint de verificación más adelante
    // Por ahora solo simulamos carga
    try {
      setLoading(true);
      const resolvedUserId = propUserId ?? params?.userId ?? params?.id ?? null;
      if (!resolvedUserId) {
        setLoading(false);
        setError('No se pudo determinar el usuario para verificar.');
        return;
      }

  const result = await auth.confirmVerification(resolvedUserId, code);
      setLoading(false);

      if (!result.success) {
        setError(result.message || 'Error al verificar el código.');
        return;
      }

      setSuccess(result.message || 'Cuenta verificada correctamente');
    } catch (e) {
      setLoading(false);
      setError('Error al verificar el código. Intenta de nuevo.');
    }
  };

  const onResend = async () => {
    setError(null);
    setSuccess(null);

    const resolvedUserId = propUserId ?? params?.userId ?? params?.id ?? null;
    if (!resolvedUserId) {
      setError('No se pudo determinar el usuario para reenviar el código.');
      return;
    }

    try {
      setLoading(true);
  const result = await resendConfirmation(resolvedUserId);
      setLoading(false);

      if (!result.success) {
        setError(result.message || 'Error al reenviar el código.');
        return;
      }

      setSuccess(result.message || 'Código reenviado exitosamente.');
      // reset cooldown
      setSecondsLeft(60);
    } catch (e) {
      setLoading(false);
      setError(e instanceof Error ? e.message : 'Error al reenviar el código');
    }
  };

  return (
    <View className="flex-1 w-full" style={{ backgroundColor: '#7C3AED', paddingTop: insets.top }}>
      <StatusBar style="light" backgroundColor="#7C3AED" translucent={false} />

      {/* Header */}
      <View
        className="absolute top-0 left-0 right-0 overflow-hidden w-full z-10"
        style={{
          backgroundColor: '#7C3AED',
          paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 20,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          minHeight: Platform.OS === 'ios' ? 200 + insets.top : 220,
          marginTop: Platform.OS === 'ios' ? -94 : -62,
          width: '100%',
        }}
      >
        <View className="absolute rounded-full opacity-10" style={{ width: 120, height: 120, backgroundColor: 'white', top: -60, right: -60 }} />
        <View className="absolute rounded-full opacity-5" style={{ width: 96, height: 96, backgroundColor: 'white', top: -30, right: -96 }} />
        <View className="absolute rounded-full opacity-10" style={{ width: 72, height: 72, backgroundColor: 'white', top: 60, left: -48 }} />

        <Pressable
          className="absolute w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', top: Platform.OS === 'ios' ? insets.top + 20 : 20, left: 16 }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>

        <View className="absolute left-6 right-6" style={{ bottom: 24 }}>
          <Text className="text-white text-xl font-nunito-bold mb-1 leading-tight">Verificar cuenta</Text>
          <Text className="text-white opacity-80 text-sm font-nunito leading-5">Ingresa el código que recibiste por correo electrónico</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 w-full">
        <View className="flex-1 bg-gray-50 px-6" style={{ paddingTop: Platform.OS === 'ios' ? 160 + insets.top : 240 }}>
          <View className="bg-white rounded-3xl p-6 shadow-lg" style={{ marginTop: 20 }}>
            {error && (
              <View className="mb-4 p-3 bg-red-100 rounded-2xl">
                <Text className="text-red-600 text-sm font-nunito-medium text-center">{error}</Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2 font-nunito">Código de verificación</Text>
              <AuthInput
                placeholder="Ingresa el código"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                error={error ? '' : undefined}
              />
            </View>

            <View className="mb-4">
              <ModernButton title={loading ? 'Verificando...' : 'Verificar'} onPress={onVerify} loading={loading} disabled={loading} variant="primary" />
            </View>

            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 font-nunito mr-2">No recibiste el código?</Text>
              <Pressable onPress={onResend} disabled={secondsLeft > 0 || loading}>
                <Text
                  className={`text-purple-600 ${secondsLeft > 0 ? 'opacity-50' : 'font-nunito-semibold'}`}
                >
                  {secondsLeft > 0 ? `Reenviar (${secondsLeft}s)` : 'Reenviar'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-row justify-center mt-8 mb-4">
            <View className="rounded-full" style={{ width: 32, height: 4, backgroundColor: '#D1D5DB' }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
