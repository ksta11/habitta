import React from 'react';
import { View, ScrollView } from 'react-native';
import ScreenSettings from '../../modules/user/userSettings/ScreenSettings';

export default function ProfileScreen() {
  return (
    <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-4 py-8">            
          <ScreenSettings />
        </View>
      </ScrollView>
  );
}