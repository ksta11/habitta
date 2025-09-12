import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import RegisterForm from './RegisterForm';

export default function ScreenRegister() {
  return (
    <View className="flex-1 w-full" style={{ backgroundColor: '#7C3AED' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 w-full"
        style={{ backgroundColor: '#7C3AED', width: '100%' }}
      >
        <RegisterForm />
      </KeyboardAvoidingView>
    </View>
  );
}