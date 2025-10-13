import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import FormEditUserProfile from './FormEditUserProfile';

export default function ScreenEditUserProfile() {
  return (
    <View className="flex-1 w-full" style={{ backgroundColor: '#7C3AED' }}>
      {/* <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
        style={{ backgroundColor: '#7C3AED', width: '100%' }}
      > */}
        <FormEditUserProfile />
      {/* </KeyboardAvoidingView> */}
    </View>
  );
}
