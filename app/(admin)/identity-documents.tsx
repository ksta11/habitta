import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PendingIdentityDocumentsComponent } from '../../modules/admin';

export default function IdentityDocumentsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header de la página */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Documentos de Identidad
          </Text>
          <Text className="text-gray-600">
            Gestiona y revisa todos los documentos de identidad pendientes
          </Text>
        </View>

        {/* Componente de documentos pendientes */}
        <PendingIdentityDocumentsComponent />
      </View>
    </ScrollView>
  );
}
