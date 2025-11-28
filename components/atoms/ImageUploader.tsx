import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import AlertModal from './AlertModal';

interface ImageUploaderProps {
  onImageSelect?: (images: ImagePicker.ImagePickerAsset[]) => void;
  maxImages?: number; // Cantidad máxima de imágenes (1-10)
  aspectRatio?: [number, number]; // Proporción de aspecto [width, height]
  quality?: number; // Calidad de 0 a 1
  allowsEditing?: boolean; // Permitir edición
  allowsMultipleSelection?: boolean; // Permitir selección múltiple (solo galería)
  source?: 'camera' | 'library' | 'both'; // Fuente de imágenes
  title?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImageUploader({ 
  onImageSelect, 
  maxImages = 1,
  aspectRatio = [4, 3],
  quality = 0.8,
  allowsEditing = true,
  allowsMultipleSelection = true,
  source = 'both',
  title = "Seleccionar imagen(es)",
  className = "",
  disabled = false
}: ImageUploaderProps) {
  // Validar que maxImages esté entre 1 y 10
  const validMaxImages = Math.min(Math.max(maxImages, 1), 10);
  const canSelectMultiple = allowsMultipleSelection && validMaxImages > 1;

  // Estado para el modal de alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{title: string, message: string, type: 'warning' | 'error'} | null>(null);
  
  // Solicitar permisos
  const requestPermissions = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setAlertData({ title: 'Permisos requeridos', message: 'Se necesitan permisos de cámara para tomar fotos.', type: 'warning' });
        setAlertVisible(true);
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlertData({ title: 'Permisos requeridos', message: 'Se necesitan permisos de galería para seleccionar imágenes.', type: 'warning' });
        setAlertVisible(true);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async (sourceType: 'camera' | 'library') => {
    if (disabled) return;
    
    try {
      const hasPermission = await requestPermissions(sourceType);
      if (!hasPermission) return;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: allowsEditing,
        aspect: aspectRatio,
        quality: quality,
        allowsMultipleSelection: sourceType === 'library' ? canSelectMultiple : false,
      };

      let result;
      if (sourceType === 'camera') {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets) {
        // Limitar la cantidad de imágenes al máximo permitido
        const limitedImages = result.assets.slice(0, validMaxImages);
        
        if (result.assets.length > validMaxImages) {
          setAlertData({
            title: 'Límite excedido',
            message: `Solo puedes seleccionar máximo ${validMaxImages} imagen${validMaxImages > 1 ? 'es' : ''}.`,
            type: 'warning'
          });
          setAlertVisible(true);
        }
        
        onImageSelect?.(limitedImages);
      }
    } catch (error) {
      setAlertData({ title: 'Error', message: 'Error al seleccionar imagen', type: 'error' });
      setAlertVisible(true);
      console.error('Image picker error:', error);
    }
  };

  const showSourceOptions = () => {
    if (source === 'camera') {
      handleImagePick('camera');
    } else if (source === 'library') {
      handleImagePick('library');
    } else {
      // Mostrar opciones si source es 'both'
      Alert.alert(
        'Seleccionar imagen',
        'Elige una opción',
        [
          { text: 'Cámara', onPress: () => handleImagePick('camera') },
          { text: 'Galería', onPress: () => handleImagePick('library') },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  // Generar título dinámico basado en maxImages si no se proporciona uno personalizado
  const getDefaultTitle = () => {
    if (validMaxImages === 1) return "Seleccionar imagen";
    return `Seleccionar hasta ${validMaxImages} imágenes`;
  };

  const displayTitle = title === "Seleccionar imagen(es)" ? getDefaultTitle() : title;

  // Determinar icono basado en la fuente
  const getIcon = () => {
    if (source === 'camera') {
      return (
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
            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
          />
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
          />
        </Svg>
      );
    } else {
      return (
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
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </Svg>
      );
    }
  };

  return (
    <View>
      <Pressable 
        onPress={showSourceOptions}
        disabled={disabled}
        className={`rounded border border-gray-300 p-4 shadow-sm ${
          disabled ? 'opacity-50' : 'active:opacity-70'
        } ${className}`}
      >
        <View className="flex flex-row items-center justify-center gap-4">
          <Text className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
            {displayTitle}
          </Text>

          {getIcon()}
        </View>
      </Pressable>

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
