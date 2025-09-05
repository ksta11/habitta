
import React, { useState } from 'react';
import { View, TouchableOpacity, Switch, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../../schemes/RegisterSchema';
import { RegisterFormDTO } from '../../../interfaces/RegisterInterface';
import { useAuth } from '../../../contexts/AuthContext';
import Label from '../../../components/atoms/Label';
import Button from '../../../components/atoms/Button';
import InputField from '../../../components/molecules/InputField';

export default function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register } = useAuth();

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
    <View className="bg-white rounded-lg p-6 shadow-lg mx-4">
      {/* Header */}
      <View className="mb-8 items-center">
        <Label 
          text="¡Crear Cuenta!" 
          size="xl" 
          weight="bold" 
          variant="default"
        />
        <View className="mt-2">
          <Label 
            text="Regístrate para comenzar" 
            size="md" 
            variant="default"
          />
        </View>
      </View>

      {/* Tabs de navegación */}
      <View className="flex-row justify-center mb-6">
        <Link href="/login" asChild>
          <TouchableOpacity className="w-1/3 pb-4 border-b border-gray-200 items-center">
            <Label 
              text="Iniciar Sesión" 
              size="md" 
              weight="medium"
              variant="default"
            />
          </TouchableOpacity>
        </Link>
        <View className="w-1/3 pb-4 border-b-2 border-green-500 items-center">
          <Label 
            text="Registrarse" 
            size="md" 
            weight="medium"
          />
        </View>
      </View>

      {/* Error general */}
      {submitError && (
        <View className="mb-4 p-3 bg-red-100 rounded-lg">
          <Label 
            text={submitError} 
            size="sm" 
            variant="error"
          />
        </View>
      )}

      {/* Formulario */}
      <View className="mb-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Nombre"
              placeholder="Ingresa tu nombre"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Teléfono"
              placeholder="Ingresa tu teléfono"
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              required
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Email"
              placeholder="Ingresa tu email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              required
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
              required
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Confirmar Contraseña"
              placeholder="Repite tu contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.confirmPassword?.message}
              required
            />
          )}
        />
        {/* Checkbox de términos y condiciones */}
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center mt-4">
              <Switch
                value={!!value}
                onValueChange={onChange}
              />
              <Label
                text="Acepto los términos y condiciones"
                size="sm"
                variant="default"
                weight="normal"
              />
              {errors.acceptTerms && (
                <Label
                  text={errors.acceptTerms.message || ''}
                  size="sm"
                  variant="error"
                  weight="normal"
                />
              )}
            </View>
          )}
        />
      </View>

      {/* Botón de submit */}
      <Button
        title={isSubmitting ? "Registrando..." : "Crear Cuenta"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        variant="primary"
        size="lg"
      />

      {/* Link al login */}
      <View className="flex-row justify-center items-center mt-6">
        <Label text="¿Ya tienes una cuenta? " size="sm" variant="default" />
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Label 
              text="Inicia sesión aquí" 
              size="sm" 
              weight="semibold"
              variant="default"
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}