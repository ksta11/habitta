import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerAtomProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  // Color props
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
  // Color defaults
  borderColor = '#D1D5DB', // gray-300
  backgroundColor = '#FFFFFF', // white
  labelColor = '#6B7280', // gray-500
  textColor = '#1F2937', // gray-800
  errorColor = '#EF4444' // red-500
}) => {
  const getBorderStyle = () => {
    if (error) {
      return {
        borderColor: errorColor,
        borderWidth: 2,
        backgroundColor: `${errorColor}10` // 10% opacity
      };
    }
    return {
      borderColor: borderColor,
      borderWidth: 2,
      backgroundColor: backgroundColor
    };
  };

  return (
    <View className="mb-4">
      {label && (
        <Text 
          className="absolute left-4 top-4 bg-white px-1 text-xs z-10" 
          style={{
            transform: [{translateY: -10}],
            color: labelColor,
            backgroundColor: backgroundColor
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
            color: textColor
          }}
        >
          {options.map(opt => (
            <Picker.Item 
              key={opt.value} 
              label={opt.label} 
              value={opt.value}
              color={textColor}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text 
          className="text-sm mt-1 ml-1"
          style={{ color: errorColor }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default PickerAtom;
