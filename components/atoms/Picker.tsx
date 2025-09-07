import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerAtomProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
}

const PickerAtom: React.FC<PickerAtomProps> = ({ label, value, onValueChange, options, error }) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="absolute left-4 top-4 bg-white px-1 text-xs text-gray-500 z-10" style={{transform: [{translateY: -10}]}}>
          {label}
        </Text>
      )}
      <View
        className={`border-2 rounded-3xl px-4 text-base mt-3 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      >
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={{ height: 50, width: '100%' }}
        >
          {options.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default PickerAtom;
