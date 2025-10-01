import React from 'react';
import { Text } from 'react-native';

interface LabelProps {
  text: string;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export default function Label({
  text,
  variant = 'default',
  size = 'md',
  weight = 'normal'
}: LabelProps) {
  const getTextStyles = () => {
    let styles = '';

    // Size styles
    switch (size) {
      case 'sm':
        styles += 'text-sm ';
        break;
      case 'lg':
        styles += 'text-lg ';
        break;
      case 'xl':
        styles += 'text-xl ';
        break;
      default:
        styles += 'text-base ';
    }

    // Weight styles
    switch (weight) {
      case 'medium':
        styles += 'font-medium ';
        break;
      case 'semibold':
        styles += 'font-semibold ';
        break;
      case 'bold':
        styles += 'font-bold ';
        break;
      default:
        styles += 'font-normal ';
    }

    // Variant styles
    switch (variant) {
      case 'error':
        styles += 'text-red-500';
        break;
      case 'success':
        styles += 'text-green-500';
        break;
      case 'warning':
        styles += 'text-yellow-500';
        break;
      default:
        styles += 'text-erie-black';
    }

    return styles;
  };

  return (
    <Text className={getTextStyles()}>
      {text}
    </Text>
  );
}
