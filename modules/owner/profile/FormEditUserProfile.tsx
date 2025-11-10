import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StatusBar as RNStatusBar, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditUserProfileDTO, editUserProfileSchema } from "../../../schemes/EditUserProfileSchema";

import useEditUserProfile from "./hooks/useEditUserProfile";

import { useAuth } from "../../../contexts/AuthContext";
import { hapticFeedback } from "../../../utils/haptics";

// Atomic Design Components
import ModernButton from "../../../components/atoms/ModernButton";
import LabeledInput from "../../../components/molecules/LabeledInput";
import PasswordInput from "../../../components/molecules/PasswordInput";

export default function FormEditUserProfile() {
  const router = useRouter();

  const { updateAuthData, updateUserData } = useAuth();
  const editHook = useEditUserProfile();

  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();
  

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#7C3AED", true);
      RNStatusBar.setBarStyle("light-content", true);
    }
    (async () => {
      const user = await editHook.loadUserProfile();
      if (user && user.id) {
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('phone', user.phone || '');
      }
    })();
    
    // Cleanup function
    return () => {
      if (Platform.OS === "android") {
        RNStatusBar.setBackgroundColor("transparent", true);
        RNStatusBar.setBarStyle("dark-content", true);
      }
    };
  }, []);

  

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserProfileDTO>({
    resolver: zodResolver(editUserProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: ""
    },
  });

  const onSubmit: SubmitHandler<EditUserProfileDTO> = async (data) => {
    console.log("📤 Datos a enviar:", data);
    const result = await editHook.submitProfile(data as any);
    if (result && result.user && result.user.id) {
      setValue('password', '');
    }
  };

  

  if (editHook.isLoading) {
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
          {/* (Become owner button removed) */}

          {/* Success message */}
          {editHook.submitSuccess && (
            <View className="mb-4 p-3 bg-green-100 rounded-2xl">
              <Text className="text-green-600 text-sm text-center">
                {editHook.submitSuccess}
              </Text>
            </View>
          )}

          {/* Error general */}
          {editHook.submitError && (
            <View className="mb-4 p-3 bg-red-100 rounded-2xl">
              <Text className="text-red-600 text-sm text-center">
                {editHook.submitError}
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
                  onTogglePassword={() => {
                    hapticFeedback.selection();
                    setShowPassword(!showPassword);
                  }}
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
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
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
        {/* Confirm modal for become owner removed */}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

