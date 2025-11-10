import React from 'react';
import ScreenHome from '../../modules/admin/home/ScreenHome';
import { ScrollView, View } from 'react-native';

export default function AdminDashboard() {
  <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
    >
    <View className="flex-1 justify-center">            
        <ScreenHome />
    </View>
  </ScrollView>
}