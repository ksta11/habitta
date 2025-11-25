import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ServicesSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const serviceOptions = [
  { label: 'Agua', value: 'agua' },
  { label: 'Gas', value: 'gas' },
  { label: 'Luz', value: 'luz' },
  { label: 'Internet', value: 'internet' },
  { label: 'Parabólica', value: 'parabolica' },
  { label: 'Administración', value: 'administracion' },
  { label: 'Parqueadero', value: 'parqueadero' },
  { label: 'Nevera', value: 'nevera' },
  { label: 'Lavadora', value: 'lavadora' },
  { label: 'Televisor', value: 'televisor' },
  { label: 'Sofá', value: 'sofa' },
  { label: 'Cama', value: 'cama' },
  { label: 'Mesa', value: 'mesa' },
  { label: 'Sillas', value: 'sillas' },
  { label: 'Lavavajillas', value: 'lavavajillas' },
  { label: 'Microondas', value: 'microondas' },
  { label: 'Aire acondicionado', value: 'aire acondicionado' },
  { label: 'Calefacción', value: 'calefaccion' },
];

export default function ServicesSelector({ value, onChange, error }: ServicesSelectorProps) {
  const [searchText, setSearchText] = useState('');
  const textInputRef = useRef<TextInput>(null);

  const selectedServices = useMemo(() => value ? value.split(',').map(s => s.trim()).filter(s => s) : [], [value]);

  const handleToggleService = (serviceValue: string) => {
    const newSelected = selectedServices.includes(serviceValue)
      ? selectedServices.filter(v => v !== serviceValue)
      : [...selectedServices, serviceValue];
    onChange(newSelected.join(', '));
    if (!selectedServices.includes(serviceValue)) {
      setSearchText('');
    }
  };

  const handleRemoveService = (serviceValue: string) => {
    const newSelected = selectedServices.filter(v => v !== serviceValue);
    onChange(newSelected.join(', '));
  };

  const filteredOptions = useMemo(() => serviceOptions.filter(opt =>
    !selectedServices.includes(opt.value) && opt.label.toLowerCase().includes(searchText.toLowerCase())
  ), [searchText, selectedServices]);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2" style={{ color: '#A346E6' }}>Servicios</Text>
      {searchText.length > 0 && (
        <View className="bg-white border border-gray-300 rounded-lg mb-2 shadow-lg" style={{ maxHeight: 60 }}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleToggleService(item.value)}
                className="flex-row items-center p-1 mr-4"
                style={{ minWidth: 120 }}
              >
                <Text className="text-xs" style={{ color: '#1F1F1F' }}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <View className="border-2 rounded-3xl p-1 flex-row items-center" style={{ borderColor: error ? '#EF4444' : '#A346E6', backgroundColor: '#F6F6F6', minHeight: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          {selectedServices.map((service, index) => (
            <View key={service} className="flex-row items-center bg-purple-200 rounded-full px-2 py-0.5 mr-1">
              <Text className="text-xs" style={{ color: '#1F1F1F' }}>{serviceOptions.find(o => o.value === service)?.label || service}</Text>
              <TouchableOpacity onPress={() => handleRemoveService(service)} className="ml-1">
                <Ionicons name="close" size={12} color="#A346E6" />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            ref={textInputRef}
            placeholder={selectedServices.length === 0 ? "Buscar y seleccionar servicios" : ""}
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 ml-1"
            style={{ color: '#1F1F1F', minWidth: 100 }}
          />
        </ScrollView>
      </View>
      {error && (
        <Text className="text-sm mt-1 ml-1" style={{ color: '#EF4444' }}>
          {error}
        </Text>
      )}
    </View>
  );
}