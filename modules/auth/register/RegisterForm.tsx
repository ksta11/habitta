import React, { useState, useEffect } from "react";
import {View,Text,TouchableOpacity,Alert,ScrollView,StatusBar as RNStatusBar, Platform} from "react-native";
import { Link, router } from "expo-router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RegisterSchema } from "../../../schemes/RegisterSchema";
import { RegisterFormDTO } from "../../../interfaces/RegisterInterface";
import { useAuth } from "../../../contexts/AuthContext";
import LabeledInput from "../../../components/molecules/LabeledInput";
import PasswordInput from "../../../components/molecules/PasswordInput";
import ToggleField from "../../../components/molecules/ToggleField";
import ModernButton from "../../../components/atoms/ModernButton";

export default function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { register } = useAuth();
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
  } = useForm<RegisterFormDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
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
          "Registro exitoso",
          result.message || "Tu cuenta ha sido creada correctamente",
          [
            {
              text: "Ir al login",
              onPress: () => router.replace("/auth/login"),
            },
          ]
        );
      } else {
        console.log("❌ Registro fallido:", result.message);
        setSubmitError(result.message || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
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
              router.replace("/");
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

          {/* Full Name Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Full Name"
                  placeholder="Your full name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
          </View>

          {/* Phone Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <LabeledInput
                  label="Phone"
                  placeholder="Your phone number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
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
          <View className="mb-3">
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

          {/* Repeat Password Input */}
          <View className="mb-3">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  label="Repeat Password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  showPassword={showRepeatPassword}
                  onTogglePassword={() =>
                    setShowRepeatPassword(!showRepeatPassword)
                  }
                />
              )}
            />
          </View>

          {/* Terms and Conditions */}
          <View className="mb-4">
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <ToggleField
                  value={value}
                  onValueChange={onChange}
                  text="I accept the"
                  linkText="Terms and Conditions"
                  error={errors.acceptTerms?.message}
                />
              )}
            />
          </View>

          {/* Register Button */}
          <View className="mb-4">
            <ModernButton
              title={isSubmitting ? "Creating account..." : "Create Account"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
            />
          </View>

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
              backgroundColor: "#D1D5DB",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
