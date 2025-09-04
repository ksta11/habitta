import React from 'react';
import { View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import FormLogin from './FormLogin';

export default function ScreenLogin() {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-400 to-purple-600">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-4 py-8">
            {/* Logo o imagen de la app (opcional) */}
            <View className="items-center mb-8">
              {/* Aquí puedes agregar tu logo */}
            </View>
            
            {/* Formulario de login */}
            <FormLogin />
            
            {/* Espacio inferior */}
            <View className="mt-8" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

