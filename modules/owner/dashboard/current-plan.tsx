import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/atoms/Card';
import { Badge } from '../../../components/atoms/Badge';
import ButtonAtom from '../../../components/atoms/ButtonAtom';

const planBenefits = ["Hasta 15 propiedades", "Gestión de solicitudes", "Reportes básicos", "Soporte por email"];

export function CurrentPlan() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <View className="flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Plan Actual</CardTitle>
          <Badge variant="secondary" className="bg-lavender-indigo/10">
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#A346E6" style={{ marginRight: 4 }} />
              <Text className="text-lavender-indigo text-xs font-medium">Destacado</Text>
            </View>
          </Badge>
        </View>
      </CardHeader>
      <CardContent className="space-y-4">
        <View className="space-y-2">
          {planBenefits.map((benefit, index) => (
            <View key={index} className="flex-row items-center gap-2">
              <Ionicons name="checkmark" size={16} color="#10B981" />
              <Text className="text-sm text-gray-600">{benefit}</Text>
            </View>
          ))}
        </View>
        <ButtonAtom
          title="Mejorar Plan"
          variant="habitta-primary"
          onPress={() => console.log('Mejorar plan pressed')}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
