import React from 'react';
import { Pressable, Text, ActivityIndicator, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonAtomProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: object;
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
  style = {}
}: ButtonAtomProps) {
  
  // Configuración de colores por variante
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: '#8B5CF6', // morado
        borderColor: '#8B5CF6',
        textColor: '#FFFFFF',
        borderWidth: 2,
      },
      secondary: {
        backgroundColor: '#6B7280', // gris
        borderColor: '#6B7280',
        textColor: '#FFFFFF',
        borderWidth: 2,
      },
      danger: {
        backgroundColor: '#EF4444', // rojo
        borderColor: '#EF4444',
        textColor: '#FFFFFF',
        borderWidth: 2,
      },
      success: {
        backgroundColor: '#10B981', // verde
        borderColor: '#10B981',
        textColor: '#FFFFFF',
        borderWidth: 2,
      },
      warning: {
        backgroundColor: '#F59E0B', // amarillo
        borderColor: '#F59E0B',
        textColor: '#FFFFFF',
        borderWidth: 2,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '#8B5CF6',
        textColor: '#8B5CF6',
        borderWidth: 2,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: '#8B5CF6',
        borderWidth: 0,
      }
    };
    
    return variants[variant];
  };

  // Configuración de tamaños
  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 14,
        iconSize: 16,
        borderRadius: 8,
        minHeight: 36,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        fontSize: 16,
        iconSize: 20,
        borderRadius: 12,
        minHeight: 48,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        fontSize: 18,
        iconSize: 24,
        borderRadius: 16,
        minHeight: 56,
      }
    };
    
    return sizes[size];
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  // Estados de disabled y loading
  const isDisabled = disabled || loading;
  const opacity = isDisabled ? 0.6 : 1;

  // Estilos del botón
  const buttonStyles: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variantStyles.borderWidth,
    borderRadius: sizeStyles.borderRadius,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    minHeight: sizeStyles.minHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity,
    ...(fullWidth && { width: '100%' }),
    ...style
  };

  // Estilos del texto
  const textStyles = {
    color: variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  };

  // Renderizar contenido del botón
  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={variantStyles.textColor} 
            style={{ marginRight: 8 }}
          />
          <Text style={textStyles}>Cargando...</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={sizeStyles.iconSize} 
              color={variantStyles.textColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={sizeStyles.iconSize} 
              color={variantStyles.textColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
    >
      {renderContent()}
    </Pressable>
  );
}
