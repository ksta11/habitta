import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <View 
      className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '', style }: CardHeaderProps) {
  return (
    <View 
      className={`mb-3 ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

export function CardTitle({ children, className = '', style }: CardTitleProps) {
  return (
    <Text 
      className={`text-lg font-semibold text-gray-900 ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
}

export function CardContent({ children, className = '', style }: CardContentProps) {
  return (
    <View 
      className={`${className}`}
      style={style}
    >
      {children}
    </View>
  );
}