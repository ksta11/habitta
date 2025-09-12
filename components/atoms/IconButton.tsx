import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function IconButton({
  iconName,
  size = 20,
  color = '#9CA3AF',
  onPress,
  disabled = false
}: IconButtonProps) {
  if (!onPress) {
    return <Ionicons name={iconName} size={size} color={color} />;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
}
