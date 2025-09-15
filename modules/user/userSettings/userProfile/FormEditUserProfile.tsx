import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar as RNStatusBar, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { editUserProfileSchema, EditUserProfileDTO } from "../../../../schemes/EditUserProfileSchema";
import { getCurrentUserProfile, updateCurrentUserProfile, beAnOwner } from "../../../../libs/userServices/api-service";
import { useAuth } from "../../../../contexts/AuthContext";

// Atomic Design Components
import LabeledInput from "../../../../components/molecules/LabeledInput";
import PasswordInput from "../../../../components/molecules/PasswordInput";
import ModernButton from "../../../../components/atoms/ModernButton";

export default function FormEditUserProfile() {
  const router = useRouter();
  const { updateAuthData } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [becomeOwnerLoading, setBecomeOwnerLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#7C3AED", true);
      RNStatusBar.setBarStyle("light-content", true);
    }
    loadUserProfile();
    
    // Cleanup function
    return () => {
      if (Platform.OS === "android") {
        RNStatusBar.setBackgroundColor("transparent", true);
        RNStatusBar.setBarStyle("dark-content", true);
      }
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCurrentUserProfile();
      if (response.user._id) {
        // Cargar datos del usuario en el formulario
        setValue('name', response.user.name);
        setValue('email', response.user.email);
        setValue('dateOfBirth', ''); // Por ahora vacío, se puede implementar después
        setValue('country', ''); // Por ahora vacío, se puede implementar después
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setSubmitError('Error al cargar el perfil del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserProfileDTO>({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dateOfBirth: "",
      country: "",
    },
  });

  const onSubmit: SubmitHandler<EditUserProfileDTO> = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);

      // console.log("📨 Actualizando perfil de usuario...", data);
      
      // Preparar datos para enviar (sin password si está vacío)
      const updateData: any = {
        name: data.name,
        email: data.email,
        ...(data.password && data.password.trim() !== '' && { password: data.password }),
      };

      // Solo agregar password si no está vacío
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      console.log("📤 Datos a enviar:", updateData);

      const result = await updateCurrentUserProfile(updateData);

      console.log("📥 Respuesta del servidor:", result);
      console.log("📥 Tipo de respuesta:", typeof result);
      console.log("📥 Estructura de respuesta:", JSON.stringify(result, null, 2));

      // Verificar si la respuesta es válida
      if (result && typeof result === 'object') {
        if (result.user && result.user._id) {
          console.log("✅ Perfil actualizado exitosamente");
          setSubmitSuccess("Perfil actualizado exitosamente");
          // Limpiar password después de actualizar
          setValue('password', '');
        } else if (result.message) {
          console.log("❌ Error del servidor:", result.message);
          setSubmitError(result.message);
        } else {
          console.log("❌ Respuesta inesperada del servidor");
          setSubmitError("Respuesta inesperada del servidor");
        }
      } else {
        console.log("❌ Respuesta inválida del servidor");
        setSubmitError("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error("❌ Error en el proceso:", error);
      setSubmitError("Error inesperado. Intenta de nuevo.");
    }
  };

  const handleBecomeOwner = async () => {
    try {
      setBecomeOwnerLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      console.log('🏠 Intentando convertir usuario a propietario...');
      
      const result = await beAnOwner();
      
      if (result.success) {
        console.log('✅ Usuario convertido a propietario exitosamente');
        setSubmitSuccess(result.message || 'Ahora eres un propietario');
        
        // Si la respuesta incluye un nuevo token y datos de usuario, actualizarlos
        if (result.data && result.data.token && result.data.user) {
          console.log('🔄 Actualizando token y datos de usuario...');
          
          // Convertir el formato de usuario del servidor al formato esperado por el contexto
          const updatedUser = {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            role: result.data.user.role,
            phone: result.data.user.phone,
            creation_date: result.data.user.creation_date
          };

          // Actualizar token y usuario en el contexto y AsyncStorage
          await updateAuthData(result.data.token, updatedUser);
          
          console.log('✅ Token y usuario actualizados correctamente');
        }
        
        // Redirigir al home de owner después de un breve delay
        setTimeout(() => {
          router.replace('/(owner)/property');
        }, 1500);
      } else {
        console.log('❌ Error al convertir usuario:', result.message);
        setSubmitError(result.message || 'Error al convertir a propietario');
      }
    } catch (error) {
      console.error('❌ Error en handleBecomeOwner:', error);
      setSubmitError('Error inesperado. Intenta de nuevo.');
    } finally {
      setBecomeOwnerLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "#7C3AED" }}>
        <Text className="text-white text-lg">Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full" style={{ backgroundColor: "#7C3AED" }}>
      <StatusBar style="light" backgroundColor="#7C3AED" translucent={false} />

      {/* Header with gradient and decorative circles - Fixed position */}
      <View
        className="absolute top-0 left-0 right-0 overflow-hidden w-full z-20"
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: Platform.OS === "ios" ? insets.top + 15 : 15,
          paddingBottom: 16,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          minHeight: Platform.OS === "ios" ? 120 + insets.top : 130,
          marginTop: Platform.OS === "ios" ? -75 : -48,
          width: "100%",
        }}
      >
        {/* Decorative circles */}
        <View
          className="absolute rounded-full opacity-10"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "white",
            top: -40,
            right: -40,
          }}
        />
        <View
          className="absolute rounded-full opacity-5"
          style={{
            width: 60,
            height: 60,
            backgroundColor: "white",
            top: -20,
            right: -60,
          }}
        />
        <View
          className="absolute rounded-full opacity-10"
          style={{
            width: 50,
            height: 50,
            backgroundColor: "white",
            top: 40,
            left: -30,
          }}
        />

        {/* Back button */}
        <TouchableOpacity
          className="absolute w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            top: Platform.OS === "ios" ? insets.top + 20 : 20,
            left: 16,
          }}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(user)/profile");
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

        {/* Header text */}
        <View className="absolute left-6 right-6" style={{ bottom: 24 }}>
          <Text className="text-white text-xl font-bold mb-1 leading-tight">
            Edit Your Profile
          </Text>
          <Text className="text-white opacity-80 text-sm leading-5">
            Update your personal information and preferences.
          </Text>
        </View>
      </View>

      {/* Form container */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 w-full"
      >
      <ScrollView
        className="flex-1 bg-gray-50 px-6"
        style={{
          paddingTop: Platform.OS === "ios" ? 95 + insets.top : 85,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{ marginTop: 20 }}
        >
          {/* Become Owner Button - Top */}
          <View className="mb-6">
            <ModernButton
              title={becomeOwnerLoading ? "Converting..." : "Become a Owner"}
              onPress={handleBecomeOwner}
              variant="secondary"
              disabled={becomeOwnerLoading}
              loading={becomeOwnerLoading}
            />
          </View>

          {/* Success message */}
          {submitSuccess && (
            <View className="mb-4 p-3 bg-green-100 rounded-2xl">
              <Text className="text-green-600 text-sm text-center">
                {submitSuccess}
              </Text>
            </View>
          )}

          {/* Error general */}
          {submitError && (
            <View className="mb-4 p-3 bg-red-100 rounded-2xl">
              <Text className="text-red-600 text-sm text-center">
                {submitError}
              </Text>
            </View>
          )}

          {/* Name Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Name"
                  placeholder="Your full name"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
          </View>

          {/* Email Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Email"
                  placeholder="your@email.com"
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Password Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  label="Password (leave empty to keep current)"
                  placeholder="••••••••"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              )}
            />
          </View>

          {/* Date of Birth Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />
          </View>

          {/* Country/Region Input */}
          <View className="mb-6">
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Country/Region"
                  placeholder="Your country or region"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.country?.message}
                />
              )}
            />
          </View>

          {/* Save Changes Button */}
          <View className="mb-4">
            <ModernButton
              title={isSubmitting ? "Saving..." : "Save Changes"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
            />
          </View>
        </View>

        {/* Page indicator */}
        <View className="flex-row justify-center mt-8 mb-4">
          <View
            className="rounded-full"
            style={{
              width: 32,
              height: 4,
              backgroundColor: "#D1D5DB",
            }}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
