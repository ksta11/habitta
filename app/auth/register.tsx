import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenRegister from '../../modules/auth/register/ScreenRegister';

export default function RegisterPage() {
  return (
    <KeyboardAvoidingView 
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-8">
          {/* Aquí usas tu módulo de registro existente */}
          <ScreenRegister />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}