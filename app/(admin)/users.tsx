import React from 'react';
import { UsersTable } from '../../modules/admin';
import { ScrollView, View } from 'react-native';

export default function UsersManagementScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <UsersTable />
      </View>
    </ScrollView>
  );
}
