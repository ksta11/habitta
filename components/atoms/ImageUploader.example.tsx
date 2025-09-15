import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageUploader from './ImageUploader';

export default function ImageUploaderExample() {
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const handleImageSelect = (images: ImagePicker.ImagePickerAsset[]) => {
    setSelectedImages(images);
    console.log('Selected images:', images);
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">Ejemplos de ImageUploader</Text>
      
      <Text className="text-sm text-gray-600 mb-6 p-3 bg-green-50 rounded">
        📱 <Text className="font-semibold">Información:</Text> ImageUploader usa expo-image-picker 
        para una experiencia optimizada con imágenes: cámara, galería, edición y compresión.
      </Text>

      {/* Foto de perfil - Solo cámara */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Foto de Perfil (Solo Cámara)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={1}
          source="camera"
          aspectRatio={[1, 1]}
          allowsEditing={true}
          className="border-blue-300 bg-blue-50"
        />
      </View>

      {/* Galería básica */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Galería Básica (Solo Galería)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={1}
          source="library"
          className="border-purple-300 bg-purple-50"
        />
      </View>

      {/* Múltiples imágenes con opciones */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Múltiples Imágenes (Cámara + Galería)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={5}
          source="both"
          aspectRatio={[16, 9]}
          quality={0.7}
          allowsEditing={true}
          className="border-green-300 bg-green-50"
        />
      </View>

      {/* Para propiedades inmobiliarias */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Fotos de Propiedad (Hasta 10)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={10}
          source="both"
          aspectRatio={[4, 3]}
          quality={0.8}
          allowsEditing={false}
          title="Subir fotos de la propiedad"
          className="border-orange-300 bg-orange-50"
        />
      </View>

      {/* Alta calidad sin edición */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Alta Calidad (Sin Edición)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={3}
          source="library"
          quality={1.0}
          allowsEditing={false}
          title="Imágenes en calidad original"
          className="border-red-300 bg-red-50"
        />
      </View>

      {/* Formato cuadrado para redes sociales */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Formato Cuadrado (Redes Sociales)</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          maxImages={4}
          source="both"
          aspectRatio={[1, 1]}
          quality={0.9}
          allowsEditing={true}
          title="Fotos para redes sociales"
          className="border-pink-300 bg-pink-50"
        />
      </View>

      {/* Estado deshabilitado */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Estado Deshabilitado</Text>
        <ImageUploader 
          onImageSelect={handleImageSelect}
          disabled={true}
          maxImages={1}
          title="Subida deshabilitada"
        />
      </View>

      {/* Casos extremos */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Casos Extremos</Text>
        <View className="space-y-2">
          <Text className="text-sm text-gray-600 mb-2">
            Valores fuera del rango se ajustan automáticamente:
          </Text>
          
          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">maxImages={0} → Se ajusta a 1</Text>
            <ImageUploader 
              onImageSelect={handleImageSelect}
              maxImages={0}
              source="library"
              className="border-yellow-300 bg-yellow-50"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">maxImages={15} → Se ajusta a 10</Text>
            <ImageUploader 
              onImageSelect={handleImageSelect}
              maxImages={15}
              source="library"
              className="border-indigo-300 bg-indigo-50"
            />
          </View>
        </View>
      </View>

      {/* Display selected images */}
      {selectedImages.length > 0 && (
        <View className="mt-6 p-4 bg-gray-100 rounded">
          <Text className="text-lg font-semibold mb-2">
            🖼️ Imágenes Seleccionadas ({selectedImages.length}):
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex flex-row gap-2">
              {selectedImages.map((image, index) => (
                <View key={index} className="relative">
                  <Image 
                    source={{ uri: image.uri }} 
                    className="w-24 h-24 rounded border-2 border-gray-300"
                    resizeMode="cover"
                  />
                  <View className="absolute -top-2 -right-2 bg-blue-500 w-6 h-6 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {selectedImages.map((image, index) => (
            <View key={index} className="mb-3 p-3 bg-white rounded border-l-4 border-green-500">
              <Text className="font-medium text-green-900">🖼️ {image.fileName || `Imagen ${index + 1}`}</Text>
              <Text className="text-gray-600">📐 Dimensiones: {image.width} x {image.height}px</Text>
              <Text className="text-gray-600">📊 Tamaño: {image.fileSize ? (image.fileSize / 1024 / 1024).toFixed(2) : 'N/A'} MB</Text>
              <Text className="text-gray-600">🎯 Tipo: {image.mimeType}</Text>
              <Text className="text-gray-600 text-xs">📍 URI: {image.uri}</Text>
              {image.exif && (
                <Text className="text-gray-500 text-xs">📷 EXIF disponible</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}