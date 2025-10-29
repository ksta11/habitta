import React from 'react';
import { ScrollView, View } from 'react-native';
import ScreenHome from '../../../modules/owner/OwnerHome';

export default function Dashboard() {
  return (
    <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
    >
    <View className="flex-1 justify-center">            
        <ScreenHome />
    </View>
    </ScrollView>
  );
}

