import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface FilterChip {
  label: string;
  value: string;
  active?: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onPress: (value: string) => void;
  variant?: 'default' | 'status' | 'type';
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onPress,
  variant = 'default',
}) => {
  const getChipStyle = (active: boolean) => {
    if (variant === 'status') {
      return active
        ? 'bg-green-100 border-green-300 text-green-800'
        : 'bg-gray-100 border-gray-300 text-gray-700';
    }
    return active
      ? 'bg-blue-100 border-blue-300 text-blue-800'
      : 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          onPress={() => onPress(filter.value)}
          className={`px-3 py-1 rounded-full border ${
            filter.active ? getChipStyle(true) : getChipStyle(false)
          }`}
        >
          <Text className={`text-sm font-medium ${
            filter.active
              ? variant === 'status'
                ? 'text-green-800'
                : 'text-blue-800'
              : 'text-gray-700'
          }`}>
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

