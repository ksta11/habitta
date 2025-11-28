import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface ReviewCommentInputProps {
  comment: string;
  onCommentChange: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function ReviewCommentInput({ 
  comment, 
  onCommentChange, 
  placeholder = "Comparte los detalles de tu experiencia con este usuario. Tu opinión ayuda a otros miembros de la comunidad...",
  maxLength = 1000
}: ReviewCommentInputProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">Cuéntanos tu experiencia</Text>
      <View className="bg-blue-50 rounded-lg border border-gray-200">
        <TextInput
          placeholder={placeholder}
          value={comment}
          onChangeText={onCommentChange}
          multiline
          numberOfLines={8}
          className="p-4 text-gray-800"
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
          maxLength={maxLength}
        />
      </View>
      <Text className="text-sm text-gray-500 mt-2">{comment.length}/{maxLength} caracteres</Text>
    </View>
  );
}