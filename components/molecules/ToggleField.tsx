import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Toggle from '../atoms/Toggle';

interface ToggleFieldProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  text: string;
  linkText?: string;
  onLinkPress?: () => void;
  error?: string;
}

export default function ToggleField({
  value,
  onValueChange,
  text,
  linkText,
  onLinkPress,
  error
}: ToggleFieldProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center">
        <Toggle
          value={value}
          onValueChange={onValueChange}
        />
        <View className="ml-3 flex-1">
          <View className="flex-row flex-wrap items-center">
            <Text className="text-gray-600 text-sm font-nunito">
              {text}{linkText && ' '}
            </Text>
            {linkText && onLinkPress && (
              <Pressable onPress={onLinkPress}>
                <Text className="text-purple-600 font-nunito-semibold text-sm underline">
                  {linkText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-nunito">
          {error}
        </Text>
      )}
    </View>
  );
}
