import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Button from '../atoms/Button';
import Label from '../atoms/Label';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  subtitleAction?: string;
  onSubtitlePress?: () => void;
}

export default function ActionButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  subtitle,
  subtitleAction,
  onSubtitlePress
}: ActionButtonProps) {
  return (
    <View className="w-full">
      <Button
        title={title}
        onPress={onPress}
        disabled={disabled}
        variant={variant}
        size={size}
      />
      
      {subtitle && (
        <View className="flex-row justify-center items-center mt-4">
          <Label text={subtitle} size="sm" variant="default" />
          {subtitleAction && onSubtitlePress && (
            <>
              <Label text=" " size="sm" />
              <TouchableOpacity onPress={onSubtitlePress}>
                <Label 
                  text={subtitleAction} 
                  size="sm" 
                  weight="semibold"
                  variant="default"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
