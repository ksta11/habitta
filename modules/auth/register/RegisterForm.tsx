import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, Alert, ScrollView, StatusBar as RNStatusBar, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RegisterSchema } from '../../../schemes/RegisterSchema';
import { RegisterFormDTO } from '../../../interfaces/RegisterInterface';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { register } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit: SubmitHandler<RegisterFormDTO> = async (data) => {
    try {
      setSubmitError(null);
      
      console.log("📝 Iniciando proceso de registro...");
      const result = await register(data);
      
      if (result.success) {
        Alert.alert(
          'Registro exitoso',
          result.message || 'Tu cuenta ha sido creada correctamente',
          [
            {
              text: 'Ir al login',
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
      } else {
        console.log("❌ Registro fallido:", result.message);
        setSubmitError(result.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
      setSubmitError('Error inesperado. Intenta de nuevo.');
    }
  };

  return (
    <View className="flex-1 w-full" style={{ backgroundColor: '#7C3AED' }}>
      <StatusBar style="light" backgroundColor="#7C3AED" translucent={false} />
      
      {/* Header with gradient and decorative circles - Fixed position */}
      <View 
        className="absolute top-0 left-0 right-0 overflow-hidden w-full z-10"
        style={{
          backgroundColor: '#7C3AED',
          paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 20,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          minHeight: Platform.OS === 'ios' ? 280 + insets.top : 280,
          marginTop: Platform.OS === 'ios' ? -94 : -62, // Eliminar completamente el espacio con el header nativo
          width: '100%', // Asegurar ancho completo
        }}
      >
          {/* Decorative circles */}
          <View 
            className="absolute rounded-full opacity-10"
            style={{
              width: 120,
              height: 120,
              backgroundColor: 'white',
              top: -60,
              right: -60,
            }}
          />
          <View 
            className="absolute rounded-full opacity-5"
            style={{
              width: 96,
              height: 96,
              backgroundColor: 'white',
              top: -30,
              right: -96,
            }}
          />
          <View 
            className="absolute rounded-full opacity-10"
            style={{
              width: 72,
              height: 72,
              backgroundColor: 'white',
              top: 60,
              left: -48,
            }}
          />

          {/* Back button */}
          <TouchableOpacity 
            className="absolute w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              top: Platform.OS === 'ios' ? insets.top + 20 : 20,
              left: 16,
            }}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>

          {/* Header text */}
          <View className="absolute left-6 right-6" style={{ bottom: 24 }}>
            <Text className="text-white text-xl font-bold mb-1 leading-tight">
              Create your new Account
            </Text>
            <Text className="text-white opacity-80 text-sm leading-5">
              Please fill in the details to create your account.
            </Text>
          </View>
        </View>

      {/* Form container */}
      <ScrollView 
        className="flex-1 bg-gray-50 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 32,
          paddingTop: Platform.OS === 'ios' ? 240 + insets.top : 240, // Espacio para el header fijo
        }}
      >
        <View className="bg-white rounded-3xl p-6 shadow-lg" style={{ marginTop: 20 }}>
          
          {/* Error general */}
          {submitError && (
            <View className="mb-4 p-3 bg-red-100 rounded-2xl">
              <Text className="text-red-600 text-sm text-center">{submitError}</Text>
            </View>
          )}

          {/* Full Name Input */}
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 ml-1">Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Your full name"
                    value={value}
                    onChangeText={onChange}
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: '#1F2937',
                      borderWidth: 0,
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.name && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Phone Input */}
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 ml-1">Phone</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Your phone number"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: '#1F2937',
                      borderWidth: 0,
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.phone && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Email Input */}
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="your@email.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: '#1F2937',
                      borderWidth: 0,
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Password Input */}
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 ml-1">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="relative">
                    <TextInput
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        paddingRight: 48,
                        fontSize: 16,
                        color: '#1F2937',
                        borderWidth: 0,
                      }}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      className="absolute right-4"
                      style={{ top: 14 }}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Repeat Password Input */}
          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-2 ml-1">Repeat Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="relative">
                    <TextInput
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showRepeatPassword}
                      style={{
                        backgroundColor: '#F9FAFB',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        paddingRight: 48,
                        fontSize: 16,
                        color: '#1F2937',
                        borderWidth: 0,
                      }}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      className="absolute right-4"
                      style={{ top: 14 }}
                      onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      <Ionicons 
                        name={showRepeatPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Terms and Conditions */}
          <View className="mb-4">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center">
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                    thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
                  />
                  <Text className="text-gray-600 text-sm ml-3 flex-1">
                    I accept the{' '}
                    <Text className="text-purple-600 font-medium">Terms and Conditions</Text>
                  </Text>
                </View>
              )}
            />
            {errors.acceptTerms && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {errors.acceptTerms.message}
              </Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="w-full rounded-2xl py-4 mb-4"
            style={{
              backgroundColor: '#7C3AED',
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-purple-600 font-medium">Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Page indicator */}
        <View className="flex-row justify-center mt-8 mb-4">
          <View 
            className="rounded-full"
            style={{
              width: 32,
              height: 4,
              backgroundColor: '#D1D5DB',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
