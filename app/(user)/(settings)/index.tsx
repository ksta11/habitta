import React from 'react';
import { ScrollView, View } from 'react-native';
import { AuthGuard } from '../../../middleware/AuthGuard';
import ScreenSettings from '../../../modules/user/settings/ScreenSettings';

export default function ProfileScreen() {
  return (
    <AuthGuard requiredRole="user">
      <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-4 py-8">            
            <ScreenSettings />
          </View>
        </ScrollView>
    </AuthGuard>
  );
}