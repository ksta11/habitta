import React from 'react';
import { View } from 'react-native';
import { StatCard, type StatCardType } from '../Atoms';

interface StatsGridProps {
  stats: StatCardType[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </View>
    </View>
  );
};

