import React from 'react';
import { Switch, View } from 'react-native';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: string;
  disabled?: boolean;
}

export default function Toggle({
  value,
  onValueChange,
  trackColor = { false: '#D1D5DB', true: '#7C3AED' },
  thumbColor,
  disabled = false
}: ToggleProps) {
  return (
    <View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={thumbColor || (value ? '#FFFFFF' : '#F3F4F6')}
        disabled={disabled}
      />
    </View>
  );
}
