import React from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ReviewSubmitButtonProps {
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  submitText?: string;
  submittingText?: string;
  validationMessage?: string;
}

export default function ReviewSubmitButton({
  onSubmit,
  isValid,
  isSubmitting,
  submitText = "Publicar reseña",
  submittingText = "Enviando...",
  validationMessage = "Escribe tu reseña para publicarla"
}: ReviewSubmitButtonProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
      <Pressable
        onPress={onSubmit}
        disabled={!isValid || isSubmitting}
        className={`w-full h-12 rounded-full items-center justify-center flex-row ${
          isValid && !isSubmitting ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
        ) : (
          <FontAwesome 
            name="send" 
            size={16} 
            color={isValid ? "white" : "#9CA3AF"} 
            style={{ marginRight: 8 }} 
          />
        )}
        <Text className={`font-medium ${isValid && !isSubmitting ? 'text-white' : 'text-gray-500'}`}>
          {isSubmitting ? submittingText : submitText}
        </Text>
      </Pressable>
      {!isValid && !isSubmitting && (
        <Text className="text-sm text-gray-500 text-center mt-2">
          {validationMessage}
        </Text>
      )}
    </View>
  );
}