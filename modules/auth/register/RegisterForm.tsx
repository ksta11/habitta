import React from "react";
import {View,Text,Pressable,ScrollView,StatusBar as RNStatusBar, Platform} from "react-native";
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import LabeledInput from "../../../components/molecules/LabeledInput";
import PasswordInput from "../../../components/molecules/PasswordInput";
import ToggleField from "../../../components/molecules/ToggleField";
import ModernButton from "../../../components/atoms/ModernButton";
import { useRegister } from "../hooks";

export default function RegisterForm() {
  const insets = useSafeAreaInsets();

  // Hook de registro
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    submitError,
    showPassword,
    showRepeatPassword,
    togglePasswordVisibility,
    toggleRepeatPasswordVisibility,
  } = useRegister();

  // Configure Android Status Bar (iOS is handled by <StatusBar /> component)
  React.useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#7C3AED", true);
      RNStatusBar.setBarStyle("light-content", true);
    }
  }, []);

  return (
    <View className="flex-1 w-full bg-violet">
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
        </Pressable>

        {/* Header text */}
        <View className="absolute left-6 right-6" style={{ bottom: 24 }}>
          <Text className="text-white text-xl font-nunito-bold mb-1 leading-tight">
            Create your new Account
          </Text>
          <Text className="text-white opacity-80 text-sm font-nunito leading-5">
            Please fill in the details to create your account.
          </Text>
        </View>
      </View>

      {/* Form container */}
      <ScrollView
        className="flex-1 bg-gray-50 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100, // Aumentamos padding para cubrir cuando aparece el teclado
          paddingTop: Platform.OS === "ios" ? 160 + insets.top : 240,
          minHeight: '100%', // Asegura que cubra toda la pantalla
        }}
      >
        <View
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{ marginTop: 20 }}
        >
          {/* Error general */}
          {submitError && (
            <View className="mb-4 p-3 bg-red-100 rounded-2xl">
              <Text className="text-red-600 text-sm font-nunito-medium text-center">
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
                  onTogglePassword={togglePasswordVisibility}
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
                  onTogglePassword={toggleRepeatPasswordVisibility}
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
                  linkText="Terms and Conditions"
                  text="I accept the"
                  onLinkPress={() => router.push("/terms")}
                  error={errors.acceptTerms?.message}
                />
              )}
            />
          </View>

          {/* Register Button */}
          <View className="mb-4">
            <ModernButton
              title={isSubmitting ? "Creating account..." : "Create Account"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
            />
          </View>

          {/* Login link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 font-nunito">Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <Pressable>
                <Text className="text-purple-600 font-nunito-semibold">Sign in</Text>
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
      </ScrollView>
    </View>
  );
}
