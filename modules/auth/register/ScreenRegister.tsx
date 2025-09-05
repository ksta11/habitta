import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import RegisterForm from './RegisterForm';

export default function ScreenRegister() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: '#7C3AED' }}
    >
      <RegisterForm />
    </KeyboardAvoidingView>
  );
}