import React, { useState, useEffect } from "react";
import {View,Text,Pressable,StatusBar as RNStatusBar,Platform} from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { loginSchema } from "../../../schemes/LoginSchema";
import { LoginDTO } from "../../../interfaces/LoginInterface";
import { useAuth } from "../../../contexts/AuthContext";

import LabeledInput from "../../../components/molecules/LabeledInput";
import PasswordInput from "../../../components/molecules/PasswordInput";
import ModernButton from "../../../components/atoms/ModernButton";

export default function FormLogin() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#7C3AED", true);
      RNStatusBar.setBarStyle("light-content", true);
    }
  }, []);


  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginDTO> = async (data) => {
    try {
      setSubmitError(null);

      console.log("📨 Iniciando proceso de login...");
      const result = await login(data);

      if (result.success) {
        console.log("✅ Login exitoso desde contexto");
        // La navegación se maneja automáticamente en el contexto
      } else {
        console.log("❌ Login fallido:", result.message);
        setSubmitError(result.message || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error en el proceso:", error);
      setSubmitError("Error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <View className="flex-1 w-full" style={{ backgroundColor: "#7C3AED" }}>
      <StatusBar style="light" backgroundColor="#7C3AED" translucent={false} />

      {/* contenedor header with gradient and decorative circles - Fixed position */}
      <View
        className="absolute top-0 left-0 right-0 overflow-hidden w-full z-10"
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: Platform.OS === "ios" ? insets.top + 20 : 20,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          minHeight: Platform.OS === "ios" ? 200 + insets.top : 220,
          marginTop: Platform.OS === "ios" ? -94 : -62, // Eliminar completamente el espacio con el header nativo
          width: "100%", // Asegurar ancho completo
        }}
      >
        {/* Decorative circles */}
        <View
          className="absolute rounded-full opacity-10"
          style={{
            width: 120,
            height: 120,
            backgroundColor: "white",
            top: -60,
            right: -60,
          }}
        />
        <View
          className="absolute rounded-full opacity-5"
          style={{
            width: 96,
            height: 96,
            backgroundColor: "white",
            top: -30,
            right: -96,
          }}
        />
        <View
          className="absolute rounded-full opacity-10"
          style={{
            width: 72,
            height: 72,
            backgroundColor: "white",
            top: 60,
            left: -48,
          }}
        />

        {/* Back button */}
        <Pressable
          className="absolute w-10 h-10 rounded-full items-center justify-center"
          style={({ pressed }) => [
            {
              backgroundColor: pressed 
                ? "rgba(255, 255, 255, 0.3)" 
                : "rgba(255, 255, 255, 0.2)",
              top: Platform.OS === "ios" ? insets.top + 20 : 20,
              left: 16,
            }
          ]}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/auth/login");
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>

        {/* Header text */}
        <View className="absolute left-6 right-6" style={{ bottom: 24 }}>
          <Text className="text-white text-xl font-bold mb-1 leading-tight">
            Welcome back to your Account
          </Text>
          <Text className="text-white opacity-80 text-sm leading-5">
            Please fill in the details to access your account.
          </Text>
        </View>
      </View>

      {/* Form container */}
      <View
        className="flex-1 bg-gray-50 px-6"
        style={{
          paddingTop: Platform.OS === "ios" ? 200 + insets.top : 180, // Espacio para el header fijo
        }}
      >
        <View
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{ marginTop: 20 }}
        >
          {/* Error general */}
          {submitError && (
            <View className="mb-4 p-3 bg-red-100 rounded-2xl">
              <Text className="text-red-600 text-sm text-center">
                {submitError}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Email"
                  placeholder="tu@email.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
              )}
            />
          </View>

          {/* Login Button */}
          <View className="mb-4">
            <ModernButton
              title={isSubmitting ? "Signing in..." : "Sign In"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
            />
          </View>

          {/* Register link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text className="text-purple-600 font-medium">Sign up</Text>
              </Pressable>
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
              backgroundColor: "#D1D5DB",
            }}
          />
        </View>
      </View>
    </View>
  );
}
