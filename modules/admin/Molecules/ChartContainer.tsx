import React from 'react';
import { Text, View } from 'react-native';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, subtitle, children }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-1">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-600">{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
};

