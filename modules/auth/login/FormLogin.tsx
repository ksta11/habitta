import React, { useState } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';

import { loginSchema } from '../../../schemes/LoginSchema';
import { LoginDTO } from '../../../interfaces/LoginInterface';
import { authenticationUser } from '../../../libs/auth/login/api-service';

// Importar componentes atómicos y moleculares
import InputField from '../../../components/molecules/InputField';
import Button from '../../../components/atoms/Button';
import Label from '../../../components/atoms/Label';

export default function FormLogin() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginDTO> = async (data) => {
    try {
      setSubmitError(null);
      
      const result = await authenticationUser(data);
      
      console.log("Resultado de autenticación:", result);

      if (result.statusCode === 500) {
        setSubmitError('Error del servidor. Intenta más tarde.');
        return;
      }

      if (result.statusCode === 401) {
        setSubmitError('Credenciales inválidas. Verifica tu email y contraseña.');
        return;
      }

      // Verificar si el login fue exitoso
      if (result.success && result.token) {
        console.log("✅ Login exitoso, token recibido:", result.token);
        console.log("👤 Usuario:", result.user);
        
        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
          { 
            text: 'OK', 
            onPress: () => {
              // Aquí puedes decodificar el token y redirigir según el rol
              // Por ahora, redirigimos a la página de usuario
              console.log("🚀 Redirigiendo a home de usuario...");
              router.replace('/(user)/home');
            }
          }
        ]);
      } else if (result.success && !result.token) {
        console.log("⚠️ Login exitoso pero sin token:", result);
        setSubmitError('Error: No se recibió el token de autenticación');
      } else {
        setSubmitError(result.message || 'Error desconocido');
      }

    } catch (error) {
      console.error("Error en el proceso:", error);
      setSubmitError('Error inesperado. Intenta de nuevo.');
    }
  };

  return (
    <View className="bg-white rounded-lg p-6 shadow-lg mx-4">
      {/* Header */}
      <View className="mb-8 items-center">
        <Label 
          text="¡Bienvenido!" 
          size="xl" 
          weight="bold" 
          variant="default"
        />
        <View className="mt-2">
          <Label 
            text="Inicia sesión en tu cuenta" 
            size="md" 
            variant="default"
          />
        </View>
      </View>

      {/* Tabs de navegación */}
      <View className="flex-row justify-center mb-6">
        <View className="w-1/3 pb-4 border-b-2 border-blue-500 items-center">
          <Label 
            text="Iniciar Sesión" 
            size="md" 
            weight="medium"
          />
        </View>
        <Link href="/register" asChild>
          <TouchableOpacity className="w-1/3 pb-4 border-b border-gray-200 items-center">
            <Label 
              text="Registrarse" 
              size="md" 
              weight="medium"
              variant="default"
            />
          </TouchableOpacity>
        </Link>
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
        {/* Campo Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Email"
              placeholder="Ingresa tu email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              error={errors.email?.message}
              required
            />
          )}
        />

        {/* Campo Password */}
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
      </View>

      {/* Botón de submit */}
      <Button
        title={isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        variant="primary"
        size="lg"
      />

      {/* Link al registro */}
      <View className="flex-row justify-center items-center mt-6">
        <Label text="¿No tienes una cuenta? " size="sm" variant="default" />
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Label 
              text="Regístrate aquí" 
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