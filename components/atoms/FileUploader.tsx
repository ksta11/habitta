import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';

interface FileUploaderProps {
  onFileSelect?: (files: DocumentPicker.DocumentPickerAsset[]) => void;
  maxFiles?: number; // Cantidad máxima de archivos (1-10)
  acceptedTypes?: string[];
  title?: string;
  className?: string;
  disabled?: boolean;
}

export default function FileUploader({ 
  onFileSelect, 
  maxFiles = 1,
  acceptedTypes = ['*/*'],
  title = "Upload your file(s)",
  className = "",
  disabled = false
}: FileUploaderProps) {
  // Validar que maxFiles esté entre 1 y 10
  const validMaxFiles = Math.min(Math.max(maxFiles, 1), 10);
  const isMultiple = validMaxFiles > 1;
  
  const handleFilePick = async () => {
    if (disabled) return;
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes,
        multiple: isMultiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        // Limitar la cantidad de archivos seleccionados al máximo permitido
        const limitedFiles = result.assets.slice(0, validMaxFiles);
        
        if (result.assets.length > validMaxFiles) {
          Alert.alert(
            'Límite excedido', 
            `Solo puedes seleccionar máximo ${validMaxFiles} archivo${validMaxFiles > 1 ? 's' : ''}.`
          );
        }
        
        onFileSelect?.(limitedFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
      console.error('File picker error:', error);
    }
  };

  // Generar título dinámico basado en maxFiles si no se proporciona uno personalizado
  const getDefaultTitle = () => {
    if (validMaxFiles === 1) return "Seleccionar archivo";
    return `Seleccionar hasta ${validMaxFiles} archivos`;
  };

  const displayTitle = title === "Upload your file(s)" ? getDefaultTitle() : title;

  return (
    <Pressable 
      onPress={handleFilePick}
      disabled={disabled}
      className={`rounded border border-gray-300 p-4 shadow-sm ${
        disabled ? 'opacity-50' : 'active:opacity-70'
      } ${className}`}
      activeOpacity={0.7}
    >
      <View className="flex flex-row items-center justify-center gap-4">
        <Text className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayTitle}
        </Text>

        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke={disabled ? '#9CA3AF' : '#111827'}
          strokeWidth={1.5}
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
          />
        </Svg>
      </View>
    </Pressable>
  );
}

