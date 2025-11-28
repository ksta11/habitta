import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FormLogin from '../../modules/auth/login/ScreenLogin';
import ScreenLogin from '../../modules/auth/login/ScreenLogin';

export default function LoginPage() {
  return (
    <KeyboardAvoidingView 
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-0">            
          <ScreenLogin />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}