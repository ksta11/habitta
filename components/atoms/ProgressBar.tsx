import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Step {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
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
          
          return (
            <View 
              key={index}
              className={`
                flex-1 flex-col items-center justify-center gap-1 p-2
                ${isActive ? 'bg-blue-50' : isCompleted ? 'bg-green-50' : 'bg-white'}
                ${index < steps.length - 1 ? 'border-r border-gray-100' : ''}
              `}
            >
              <Ionicons
                name={step.icon}
                size={18}
                color={
                  isCompleted 
                    ? '#059669' // green-600
                    : isActive 
                    ? '#2563eb' // blue-600
                    : '#6b7280' // gray-500
                }
              />
              
              <View className="items-center">
                <Text className={`
                  text-xs font-medium text-center
                  ${isCompleted 
                    ? 'text-green-600' 
                    : isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-900'
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