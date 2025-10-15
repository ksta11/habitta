import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';

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
  return (
    <View className="px-6 mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex gap-3"
      >
        <Pressable
          onPress={() => onCategorySelect('todos')}
          className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
            selectedCategory === 'todos' ? "bg-violet" : "bg-gray-100"
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
            className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category.value ? "bg-violet" : "bg-gray-100"
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