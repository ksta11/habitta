import React from 'react';
import { Pressable, Text, ActivityIndicator, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonAtomProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'ghost' | 'habitta-primary' | 'habitta-secondary' | 'habitta-outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export default function ButtonAtom({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = ''
}: ButtonAtomProps) {
  
  // Configuración de estilos por variante usando Tailwind
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-blue-500 border-blue-500 border-2',
      secondary: 'bg-gray-600 border-gray-600 border-2',
      danger: 'bg-red-500 border-red-500 border-2',
      success: 'bg-green-500 border-green-500 border-2',
      warning: 'bg-yellow-500 border-yellow-500 border-2',
      outline: 'bg-white-traffic border-blue-500 border-2',
      ghost: 'bg-transparent border-transparent',
      'habitta-primary': 'bg-violet border-violet border-2',
      'habitta-secondary': 'bg-lavender-indigo border-lavender-indigo border-2',
      'habitta-outline': 'bg-white border-violet border-2'
    };
    
    return variants[variant];
  };

  // Configuración de colores de texto por variante
  const getTextColorClasses = () => {
    const textColors = {
      primary: 'text-white',
      secondary: 'text-white',
      danger: 'text-white',
      success: 'text-white',
      warning: 'text-white',
      outline: 'text-blue-500',
      ghost: 'text-blue-500',
      'habitta-primary': 'text-white',
      'habitta-secondary': 'text-white',
      'habitta-outline': 'text-violet'
    };
    
    return textColors[variant];
  };

  // Configuración de tamaños usando Tailwind
  const getSizeClasses = () => {
    const sizes = {
      small: 'py-2 px-4 min-h-[36px] rounded-2xl',
      medium: 'py-3 px-6 min-h-[48px] rounded-[20px]',
      large: 'py-4 px-8 min-h-[56px] rounded-3xl'
    };
    
    return sizes[size];
  };

  // Configuración de tamaños de texto e íconos
  const getContentSizes = () => {
    const sizes = {
      small: { fontSize: 14, iconSize: 16 },
      medium: { fontSize: 16, iconSize: 20 },
      large: { fontSize: 18, iconSize: 24 }
    };
    
    return sizes[size];
  };

  const variantClasses = getVariantClasses();
  const textColorClasses = getTextColorClasses();
  const sizeClasses = getSizeClasses();
  const contentSizes = getContentSizes();
  
  // Estados de disabled y loading
  const isDisabled = disabled || loading;
  const opacityClass = isDisabled ? 'opacity-60' : 'opacity-100';
  const widthClass = fullWidth ? 'w-full' : '';

  // Clases base del botón con sombra
  const buttonClasses = `
    ${variantClasses}
    ${sizeClasses}
    ${opacityClass}
    ${widthClass}
    flex-row items-center justify-center
    shadow-lg
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Clases del texto
  const textClasses = `${textColorClasses} font-semibold text-center`;

  // Renderizar contenido del botón
  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-row items-center">
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' || variant === 'habitta-outline' ? 
              (variant === 'habitta-outline' ? '#531A99' : '#3B82F6') : '#FFFFFF'}
            style={{ marginRight: 8 }}
          />
          <Text 
            className={textClasses}
            style={{ fontSize: contentSizes.fontSize }}
          >
            Cargando...
          </Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View className="flex-row items-center">
          {iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={contentSizes.iconSize} 
              color={variant === 'outline' || variant === 'ghost' || variant === 'habitta-outline' ? 
                (variant === 'habitta-outline' ? '#531A99' : '#3B82F6') : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
          )}
          <Text 
            className={textClasses}
            style={{ fontSize: contentSizes.fontSize }}
          >
            {title}
          </Text>
          {iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={contentSizes.iconSize} 
              color={variant === 'outline' || variant === 'ghost' || variant === 'habitta-outline' ? 
                (variant === 'habitta-outline' ? '#531A99' : '#3B82F6') : '#FFFFFF'}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      );
    }

    return (
      <Text 
        className={textClasses}
        style={{ fontSize: contentSizes.fontSize }}
      >
        {title}
      </Text>
    );
  };

  return (
    <Pressable
      className={buttonClasses}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6, // Para Android
      }}
      onPress={onPress}
      disabled={isDisabled}
    >
      {renderContent()}
    </Pressable>
  );
}
