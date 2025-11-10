import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor?: string;
  subtitle?: string;
}

interface StatCardProps {
  stat: StatCard;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const bgColor = stat.bgColor || `${stat.color}20`;
  
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 w-[48%] mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-600 text-sm font-medium mb-1">{stat.title}</Text>
          <Text className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</Text>
          {stat.subtitle && (
            <Text className="text-xs text-gray-500">{stat.subtitle}</Text>
          )}
        </View>
        <View 
          className="p-3 rounded-full ml-3"
          style={{ backgroundColor: bgColor }}
        >
          <FontAwesome 
            name={stat.icon as any} 
            size={20} 
            color={stat.color} 
          />
        </View>
      </View>
    </View>
  );
};

