import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import FormLogin from './FormLogin';

export default function ScreenLogin() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#7C3AED' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ backgroundColor: '#7C3AED' }}
      >
        <FormLogin />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

