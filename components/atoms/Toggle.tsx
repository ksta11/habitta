import React from 'react';
import { Switch, View } from 'react-native';
import { hapticFeedback } from '../../utils/haptics';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: string;
  disabled?: boolean;
  enableHaptics?: boolean; // Nueva prop para habilitar/deshabilitar haptics
}

export default function Toggle({
  value,
  onValueChange,
  trackColor = { false: '#D1D5DB', true: '#7C3AED' },
  thumbColor,
  disabled = false,
  enableHaptics = true
}: ToggleProps) {
  
  // Función para manejar el cambio con haptics
  const handleValueChange = (newValue: boolean) => {
    if (!disabled && enableHaptics) {
      // Feedback háptico al cambiar el toggle
      hapticFeedback.toggleSwitch();
    }
    onValueChange(newValue);
  };
  
  return (
    <View>
      <Switch
        value={value}
        onValueChange={handleValueChange}
        trackColor={trackColor}
        thumbColor={thumbColor || (value ? '#FFFFFF' : '#F3F4F6')}
        disabled={disabled}
      />
    </View>
  );
}
