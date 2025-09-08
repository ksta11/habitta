import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import FormEditUserProfile from '../../modules/user/userSettings/userProfile/FormEditUserProfile';
import ScreenEditUserProfile from '../../../modules/user/userSettings/userProfile/ScreenEditUserProfile';

export default function LoginPage() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-8">            
          <ScreenEditUserProfile />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}