import React from 'react';
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  style?: ImageStyle;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const textSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Avatar({ 
  size = 'md', 
  className = '', 
  style, 
  children 
}: AvatarProps) {
  return (
    <View 
      className={`${sizeStyles[size]} rounded-full bg-gray-200 items-center justify-center overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

export function AvatarImage({ src, alt, style }: AvatarImageProps) {
  if (!src) return null;
  
  return (
    <Image 
      source={{ uri: src }}
      style={[{ width: '100%', height: '100%' }, style]}
      resizeMode="cover"
    />
  );
}

export function AvatarFallback({ 
  children, 
  className = '', 
  style,
  textStyle 
}: AvatarFallbackProps) {
  return (
    <View 
      className={`w-full h-full items-center justify-center bg-lavender-indigo/10 ${className}`}
      style={style}
    >
      <Text 
        className={`font-medium text-lavender-indigo ${textSizeStyles.md}`}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}