import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface Step {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepPress?: (stepNumber: number) => void;
}

export default function ProgressBar({ steps, currentStep, onStepPress }: ProgressBarProps) {
  // Validar que haya entre 2 y 5 pasos
  if (steps.length < 2 || steps.length > 5) {
    throw new Error('ProgressBar debe tener entre 2 y 5 pasos');
  }

  // Validar que currentStep esté en el rango válido
  if (currentStep < 1 || currentStep > steps.length) {
    throw new Error(`currentStep debe estar entre 1 y ${steps.length}`);
  }

  return (
    <View>
      <Text className="sr-only">Steps</Text>
      
      <View className="flex-row rounded-lg border border-gray-100 overflow-hidden">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          // Solo los pasos completados son presionables
          if (isCompleted && onStepPress) {
            return (
              <Pressable 
                key={index}
                onPress={() => onStepPress(stepNumber)}
                className={`
                  flex-1 flex-col items-center justify-center gap-1 p-2
                  ${isActive ? 'bg-lavender-indigo/10' : isCompleted ? 'bg-violet/10' : 'bg-white'}
                  ${index < steps.length - 1 ? 'border-r border-gray-100' : ''}
                `}
              >
                <Ionicons
                  name={step.icon}
                  size={18}
                  color={
                    isCompleted 
                      ? '#531A99' // violet (más vibrante que deep-violet)
                      : isActive 
                      ? '#A346E6' // lavender-indigo (vibrante)
                      : '#9CA3AF' // gray-400 (más claro que antes)
                  }
                />
                
                <View className="items-center">
                  <Text className={`
                    text-xs font-medium text-center
                    ${isCompleted 
                      ? 'text-violet' 
                      : isActive 
                      ? 'text-lavender-indigo' 
                      : 'text-gray-600'
                    }
                  `}>
                    {step.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5 text-center">
                    {step.description}
                  </Text>
                </View>
              </Pressable>
            );
          }

          return (
            <View 
              key={index}
              className={`
                flex-1 flex-col items-center justify-center gap-1 p-2
                ${isActive ? 'bg-lavender-indigo/10' : isCompleted ? 'bg-violet/10' : 'bg-white'}
                ${index < steps.length - 1 ? 'border-r border-gray-100' : ''}
              `}
            >
              <Ionicons
                name={step.icon}
                size={18}
                color={
                  isCompleted 
                    ? '#531A99' // violet (más vibrante que deep-violet)
                    : isActive 
                    ? '#A346E6' // lavender-indigo (vibrante)
                    : '#9CA3AF' // gray-400 (más claro que antes)
                }
              />
              
              <View className="items-center">
                <Text className={`
                  text-xs font-medium text-center
                  ${isCompleted 
                    ? 'text-violet' 
                    : isActive 
                    ? 'text-lavender-indigo' 
                    : 'text-gray-600'
                  }
                `}>
                  {step.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5 text-center">
                  {step.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}