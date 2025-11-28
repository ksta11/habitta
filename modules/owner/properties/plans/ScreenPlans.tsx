import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { INSURANCE_TERMS, PLANS } from '../../../../interfaces/PlansInterface';
import {
  standarScreenBackground
} from '../../../../utils/TokensDesing';
import { hapticFeedback } from '../../../../utils/haptics';

export default function ScreenPlans() {
  const router = useRouter();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const togglePlan = (planId: string) => {
    hapticFeedback.selection();
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  return (
    <View className={`flex-1 ${standarScreenBackground}`}>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-semibold text-blue-900 mb-1">
                Elige el plan ideal para ti
              </Text>
              <Text className="text-xs text-blue-800 leading-5">
                Todos los planes incluyen la publicación de propiedades. Toca cada plan para ver todos los detalles.
              </Text>
            </View>
          </View>
        </View>

        {/* Cards de planes expandibles */}
        {PLANS.map((plan) => (
          <View key={plan.id} className="mb-4">
            <Pressable
              onPress={() => togglePlan(plan.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <LinearGradient
                colors={plan.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl p-6 shadow-lg"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {/* Header compacto */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-white/20 rounded-2xl p-3 mr-3">
                      <Ionicons name={plan.icon as any} size={28} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-white text-xl font-bold">{plan.name}</Text>
                        {plan.recommended && (
                          <View className="bg-yellow-400 rounded-full px-2 py-0.5 ml-2">
                            <Text className="text-purple-900 text-xs font-bold">⭐</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-white text-2xl font-bold mt-1">{plan.price}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={expandedPlan === plan.id ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </View>

                {/* Contenido expandible */}
                {expandedPlan === plan.id && (
                  <View className="mt-4 pt-4 border-t border-white/20">
                    {/* Duración y descripción */}
                    <Text className="text-white/90 text-sm mb-4">
                      📅 {plan.duration} • {plan.description}
                    </Text>

                    {/* Incluye */}
                    <View className="mb-4">
                      <Text className="text-white font-bold text-base mb-2">✅ Incluye:</Text>
                      {plan.features.map((feature, index) => (
                        <View key={index} className="flex-row items-start mb-2">
                          <Text className="text-white/90 text-sm">• {feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* No incluye */}
                    {plan.notIncluded.length > 0 && (
                      <View className="mb-4">
                        <Text className="text-white font-bold text-base mb-2">❌ No incluye:</Text>
                        {plan.notIncluded.map((feature, index) => (
                          <View key={index} className="flex-row items-start mb-2">
                            <Text className="text-white/70 text-sm">• {feature}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Información del seguro */}
                    {plan.hasInsurance && plan.insuranceNote && (
                      <View className="bg-white/20 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-center mb-2">
                          <Ionicons 
                            name={plan.insuranceType === 'included' ? 'shield-checkmark' : 'shield-outline'} 
                            size={20} 
                            color="#FFFFFF" 
                          />
                          <Text className="text-white font-bold ml-2">
                            {plan.insuranceType === 'included' ? '🛡️ Seguro Incluido' : '🛡️ Seguro Opcional'}
                          </Text>
                        </View>
                        <Text className="text-white/90 text-xs leading-5">{plan.insuranceNote}</Text>
                      </View>
                    )}
                  </View>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        ))}

        {/* Comparación rápida */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="git-compare-outline" size={24} color="#6D28D9" />
            <Text className="text-lg font-bold text-gray-900 ml-2">
              Comparación rápida
            </Text>
          </View>
          
          <View className="space-y-3">
            <View className="border-l-4 border-purple-600 pl-3 py-2">
              <Text className="font-bold text-gray-900">Básico: Gratis</Text>
              <Text className="text-sm text-gray-600">Solo publicación (15 días)</Text>
            </View>

            <View className="border-l-4 border-purple-700 pl-3 py-2">
              <Text className="font-bold text-gray-900">Destacado: $11.900/mes</Text>
              <Text className="text-sm text-gray-600">Publicación + Visibilidad destacada</Text>
            </View>

            <View className="border-l-4 border-purple-800 pl-3 py-2">
              <Text className="font-bold text-gray-900">Gestión: 2.5% del arriendo</Text>
              <Text className="text-sm text-gray-600">Gestión completa + Seguro opcional</Text>
            </View>

            <View className="border-l-4 border-purple-900 pl-3 py-2 bg-purple-50 rounded-lg">
              <Text className="font-bold text-gray-900">Integral: 5% del arriendo ⭐</Text>
              <Text className="text-sm text-gray-600">Todo incluido + Seguro pagado</Text>
            </View>
          </View>
        </View>

        {/* Términos del seguro completos */}
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <Ionicons name="shield-checkmark-outline" size={28} color="#6D28D9" />
            <Text className="text-xl font-bold text-gray-900 ml-3">
              Términos del Seguro
            </Text>
          </View>

          {/* Banner de advertencia */}
          <View className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-4">
            <View className="flex-row items-start">
              <View className="bg-amber-500 rounded-full p-2 mr-3">
                <Ionicons name="warning" size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-amber-900 mb-1">
                  Importante: Lea cuidadosamente
                </Text>
                <Text className="text-xs text-amber-800 leading-5">
                  Términos aplicables a planes Gestión e Integral
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-gray-700 text-sm leading-6 mb-4">
            {INSURANCE_TERMS}
          </Text>

          {/* Puntos clave */}
          <View className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <Text className="text-base font-bold text-purple-900 mb-3">
              Puntos Clave:
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="bg-purple-500 rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
                  <Text className="text-white font-bold text-xs">1</Text>
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  <Text className="font-semibold">Proveedor Externo:</Text> El seguro es proporcionado por una aseguradora independiente.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="bg-purple-500 rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
                  <Text className="text-white font-bold text-xs">2</Text>
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  <Text className="font-semibold">Habitta como Intermediario:</Text> Solo facilitamos la contratación.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="bg-purple-500 rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
                  <Text className="text-white font-bold text-xs">3</Text>
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  <Text className="font-semibold">Términos del Asegurador:</Text> Coberturas y exclusiones definidas por ellos.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="bg-purple-500 rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
                  <Text className="text-white font-bold text-xs">4</Text>
                </View>
                <Text className="flex-1 text-gray-700 text-sm">
                  <Text className="font-semibold">Responsabilidad Limitada:</Text> Habitta no decide sobre reclamaciones.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diferencias por plan */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Seguro por Plan
          </Text>

          <View className="mb-4 pb-4 border-b border-gray-200">
            <View className="flex-row items-center mb-2">
              <View className="bg-blue-500 rounded-lg p-2 mr-2">
                <Ionicons name="shield-outline" size={18} color="#FFFFFF" />
              </View>
              <Text className="text-base font-bold text-gray-900">Plan Gestión</Text>
            </View>
            <View className="bg-blue-50 rounded-xl p-3">
              <Text className="text-sm text-gray-700 leading-5">
                <Text className="font-semibold">Seguro Opcional:</Text> Puedes contratarlo como servicio adicional. El costo corre por tu cuenta.
              </Text>
            </View>
          </View>

          <View>
            <View className="flex-row items-center mb-2">
              <View className="bg-green-500 rounded-lg p-2 mr-2">
                <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
              </View>
              <Text className="text-base font-bold text-gray-900">Plan Integral</Text>
            </View>
            <View className="bg-green-50 rounded-xl p-3">
              <Text className="text-sm text-gray-700 leading-5">
                <Text className="font-semibold">Seguro Incluido:</Text> Habitta cubre el costo mensual, pero la aseguradora decide sobre reclamaciones.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}