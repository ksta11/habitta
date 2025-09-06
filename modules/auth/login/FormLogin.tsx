import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
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

const { height } = Dimensions.get("window");

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

      {/* Header with gradient and decorative circles - Fixed position */}
      <View
        className="absolute top-0 left-0 right-0 overflow-hidden w-full z-10"
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: Platform.OS === "ios" ? insets.top + 20 : 20,
          paddingBottom: 24,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          minHeight: Platform.OS === "ios" ? 280 + insets.top : 280,
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
              router.replace('/auth/login');
            }
          }}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

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
          paddingTop: Platform.OS === "ios" ? 240 + insets.top : 240, // Espacio para el header fijo
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
            <Text className="text-gray-600 text-sm mb-2 ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="tu@email.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
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
          <View className="mb-4">
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
                        backgroundColor: "#F9FAFB",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        paddingRight: 48,
                        fontSize: 16,
                        color: "#1F2937",
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

          {/* Login Button */}
          <TouchableOpacity
            className="w-full rounded-2xl py-4 mb-4"
            style={{
              backgroundColor: "#7C3AED",
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Register link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-purple-600 font-medium">Sign up</Text>
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
              backgroundColor: "#D1D5DB",
            }}
          />
        </View>
      </View>
    </View>
  );
}
