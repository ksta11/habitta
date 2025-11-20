import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { standarChipPressed, standarChipSelected, standarChipUnselected } from '../../../utils/TokensDesing';

interface Category {
  id: number;
  name: string;
  icon: string;
  value: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryValue: string) => void;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategorySelect
}: CategorySelectorProps) {
  const [pressedCategory, setPressedCategory] = useState<string | null>(null);

  return (
    <View className="px-6 mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex gap-3"
      >
        <Pressable
          onPress={() => onCategorySelect('todos')}
          onPressIn={() => setPressedCategory('todos')}
          onPressOut={() => setPressedCategory(null)}
          className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
            pressedCategory === 'todos' && selectedCategory === 'todos' 
              ? standarChipPressed 
              : selectedCategory === 'todos' 
                ? standarChipSelected 
                : standarChipUnselected
          }`}
        >
          <Text>🏠</Text>
          <Text className={`text-sm font-medium ${
            selectedCategory === 'todos' ? "text-white" : "text-gray-700"
          }`}>
            Todos
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onCategorySelect(category.value)}
            onPressIn={() => setPressedCategory(category.value)}
            onPressOut={() => setPressedCategory(null)}
            className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
              pressedCategory === category.value && selectedCategory === category.value
                ? standarChipPressed
                : selectedCategory === category.value
                  ? standarChipSelected
                  : standarChipUnselected
            }`}
          >
            <Text>{category.icon}</Text>
            <Text className={`text-sm font-medium ${
              selectedCategory === category.value ? "text-white" : "text-gray-700"
            }`}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}