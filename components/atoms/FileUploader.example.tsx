import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import FileUploader from './FileUploader';

export default function FileUploaderExample() {
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const handleFileSelect = (files: DocumentPicker.DocumentPickerAsset[]) => {
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">Ejemplos de FileUploader</Text>
      
      <Text className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded">
        📋 <Text className="font-semibold">Información:</Text> El parámetro `maxFiles` acepta valores de 1 a 10. 
        Valores fuera de este rango se ajustarán automáticamente.
      </Text>
      
      {/* Basic file uploader - 1 archivo */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Un Archivo (Predeterminado)</Text>
        <FileUploader onFileSelect={handleFileSelect} />
      </View>

      {/* 2 archivos máximo */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Máximo 2 Archivos</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          maxFiles={2}
        />
      </View>

      {/* 3 archivos máximo */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Máximo 3 Archivos</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          maxFiles={3}
        />
      </View>

      {/* 5 archivos máximo */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Máximo 5 Archivos</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          maxFiles={5}
        />
      </View>

      {/* 10 archivos máximo (límite) */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Máximo 10 Archivos (Límite)</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          maxFiles={10}
        />
      </View>

      {/* Image only uploader */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Solo Imágenes (Máx 3)</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          acceptedTypes={['image/*']}
          maxFiles={3}
          title="Seleccionar hasta 3 imágenes"
          className="border-blue-300 bg-blue-50"
        />
      </View>

      {/* PDF only uploader */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Solo PDF (Máx 2)</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          acceptedTypes={['application/pdf']}
          maxFiles={2}
          title="Seleccionar hasta 2 PDFs"
          className="border-red-300 bg-red-50"
        />
      </View>

      {/* Título personalizado con límite */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Título Personalizado</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          maxFiles={4}
          title="Subir documentos importantes"
          className="border-green-300 bg-green-50"
        />
      </View>

      {/* Disabled uploader */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Estado Deshabilitado</Text>
        <FileUploader 
          onFileSelect={handleFileSelect}
          disabled={true}
          maxFiles={1}
          title="Carga deshabilitada"
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
            <Text className="text-sm font-medium mb-1">maxFiles={0} → Se ajusta a 1</Text>
            <FileUploader 
              onFileSelect={handleFileSelect}
              maxFiles={0}
              className="border-yellow-300 bg-yellow-50"
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-medium mb-1">maxFiles={15} → Se ajusta a 10</Text>
            <FileUploader 
              onFileSelect={handleFileSelect}
              maxFiles={15}
              className="border-orange-300 bg-orange-50"
            />
          </View>
        </View>
      </View>

      {/* Display selected files */}
      {selectedFiles.length > 0 && (
        <View className="mt-6 p-4 bg-gray-100 rounded">
          <Text className="text-lg font-semibold mb-2">
            Archivos Seleccionados ({selectedFiles.length}):
          </Text>
          {selectedFiles.map((file, index) => (
            <View key={index} className="mb-3 p-3 bg-white rounded border-l-4 border-blue-500">
              <Text className="font-medium text-blue-900">📄 {file.name}</Text>
              <Text className="text-gray-600">📊 Tamaño: {(file.size! / 1024).toFixed(2)} KB</Text>
              <Text className="text-gray-600">🎯 Tipo: {file.mimeType}</Text>
              <Text className="text-gray-600 text-xs">📍 URI: {file.uri}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}