import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerAtomProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  // Variant prop for predefined styles
  variant?: 'default' | 'habitta' | 'habitta-light' | 'error';
  // Color props for custom styling (overrides variant)
  borderColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  textColor?: string;
  errorColor?: string;
}

const PickerAtom: React.FC<PickerAtomProps> = ({ 
  label, 
  value, 
  onValueChange, 
  options, 
  error,
  variant = 'default',
  // Color defaults (will be overridden by variant if not explicitly provided)
  borderColor,
  backgroundColor,
  labelColor,
  textColor,
  errorColor
}) => {
  // Get colors based on variant
  const getVariantColors = () => {
    const variants = {
      default: {
        borderColor: '#D1D5DB', // gray-300
        backgroundColor: '#FFFFFF', // white
        labelColor: '#6B7280', // gray-500
        textColor: '#1F2937', // gray-800
        errorColor: '#EF4444' // red-500
      },
      habitta: {
        borderColor: '#531A99', // violet
        backgroundColor: '#F6F6F6', // white-traffic
        labelColor: '#531A99', // violet
        textColor: '#1F1F1F', // erie-black
        errorColor: '#EF4444' // red-500
      },
      'habitta-light': {
        borderColor: '#A346E6', // lavender-indigo
        backgroundColor: '#F6F6F6', // white-traffic
        labelColor: '#A346E6', // lavender-indigo
        textColor: '#1F1F1F', // erie-black
        errorColor: '#EF4444' // red-500
      },
      error: {
        borderColor: '#EF4444', // red-500
        backgroundColor: '#FEF2F2', // red-50
        labelColor: '#EF4444', // red-500
        textColor: '#1F2937', // gray-800
        errorColor: '#EF4444' // red-500
      }
    };
    
    return variants[variant];
  };

  const variantColors = getVariantColors();

  // Use provided colors or fall back to variant colors
  const finalColors = {
    borderColor: borderColor || variantColors.borderColor,
    backgroundColor: backgroundColor || variantColors.backgroundColor,
    labelColor: labelColor || variantColors.labelColor,
    textColor: textColor || variantColors.textColor,
    errorColor: errorColor || variantColors.errorColor
  };
  const getBorderStyle = () => {
    if (error) {
      return {
        borderColor: finalColors.errorColor,
        borderWidth: 2,
        backgroundColor: `${finalColors.errorColor}10` // 10% opacity
      };
    }
    return {
      borderColor: finalColors.borderColor,
      borderWidth: 2,
      backgroundColor: finalColors.backgroundColor
    };
  };

  return (
    <View className="mb-4">
      {label && (
        <Text 
          className="absolute left-4 top-4 bg-white px-1 text-xs z-10 rounded-sm" 
          style={{
            transform: [{translateY: -10}],
            color: finalColors.labelColor,
            backgroundColor: finalColors.backgroundColor
          }}
        >
          {label}
        </Text>
      )}
      <View
        className="rounded-3xl px-4 text-base mt-3"
        style={getBorderStyle()}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ 
            height: 50, 
            width: '100%',
            color: finalColors.textColor
          }}
        >
          {options.map(opt => (
            <Picker.Item 
              key={opt.value} 
              label={opt.label} 
              value={opt.value}
              color={finalColors.textColor}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text 
          className="text-sm mt-1 ml-1"
          style={{ color: finalColors.errorColor }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default PickerAtom;
