import React from 'react';
import { PropertiesTable } from '../../modules/admin';
import { ScrollView, View } from 'react-native';

export default function PropertiesManagementScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <PropertiesTable />
      </View>
    </ScrollView>
  );
}