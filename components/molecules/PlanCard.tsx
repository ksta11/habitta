import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Plan } from '../../interfaces/PlansInterface';
import { hapticFeedback } from '../../utils/haptics';

interface PlanCardProps {
  plan: Plan;
  onPress: (plan: Plan) => void;
}

export default function PlanCard({ plan, onPress }: PlanCardProps) {
  const handlePress = () => {
    hapticFeedback.buttonPress();
    onPress(plan);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
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
        {/* Header con icono y recommended badge */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="bg-white/20 rounded-2xl p-3 mr-3">
              <Ionicons name={plan.icon as any} size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">{plan.name}</Text>
              {plan.recommended && (
                <View className="bg-yellow-400 rounded-full px-3 py-1 mt-1">
                  <Text className="text-purple-900 text-xs font-bold">⭐ Recomendado</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Precio */}
        <View className="mb-4">
          <Text className="text-white text-4xl font-bold">{plan.price}</Text>
          <Text className="text-white/80 text-base mt-1">
            {plan.price === 'Gratis' ? plan.duration : `${plan.duration} • ${plan.id === 'management' || plan.id === 'integral' ? 'del valor del arriendo' : 'por mes'}`}
          </Text>
        </View>

        {/* Descripción */}
        <Text className="text-white/90 text-base mb-4">{plan.description}</Text>

        {/* Características principales (primeras 3) */}
        <View className="mb-4">
          {plan.features.slice(0, 3).map((feature, index) => (
            <View key={index} className="flex-row items-start mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8, marginTop: 2 }} />
              <Text className="text-white/90 text-sm flex-1">{feature}</Text>
            </View>
          ))}
          {plan.features.length > 3 && (
            <Text className="text-white/70 text-sm italic mt-2">
              +{plan.features.length - 3} características más
            </Text>
          )}
        </View>

        {/* Badge de seguro si aplica */}
        {plan.hasInsurance && (
          <View className={`rounded-2xl p-3 mb-4 ${plan.insuranceType === 'included' ? 'bg-green-500/30' : 'bg-blue-500/30'}`}>
            <View className="flex-row items-center">
              <Ionicons 
                name={plan.insuranceType === 'included' ? 'shield-checkmark' : 'shield-outline'} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text className="text-white font-semibold ml-2">
                {plan.insuranceType === 'included' ? 'Seguro incluido' : 'Seguro opcional'}
              </Text>
            </View>
          </View>
        )}

        {/* Botón */}
        <Pressable
          onPress={handlePress}
          className="bg-white rounded-2xl py-3 px-6 flex-row items-center justify-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text className="text-purple-900 font-bold text-base mr-2">Ver detalles</Text>
          <Ionicons name="arrow-forward" size={20} color="#581C87" />
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
}
