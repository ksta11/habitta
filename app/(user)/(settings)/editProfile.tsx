import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import EditUserProfileScreen from '../../../modules/user/profile/EditUserProfileScreen';

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
          <EditUserProfileScreen />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}