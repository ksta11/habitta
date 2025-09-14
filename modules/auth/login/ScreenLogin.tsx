import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormLogin from './FormLogin';

export default function ScreenLogin() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 w-full" 
      style={{ 
        backgroundColor: '#7C3AED',
        paddingTop: insets.top,
      }}
    >
      <KeyboardAvoidingView 
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 w-full"
        style={{ backgroundColor: '#7C3AED' }}
      >
        <FormLogin />
      </KeyboardAvoidingView>
    </View>
  );
}

