import React from 'react';
import { SolicitudesTable } from '../../modules/admin';
import { ScrollView, View } from 'react-native';

export default function SolicitudesManagementScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <SolicitudesTable />
      </View>
    </ScrollView>
  );
}