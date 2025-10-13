import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card, CardContent } from '../atoms/Card';
import { Review } from '../../libs/user/review-service';

interface ReviewCardProps {
  review: Review;
  onPress: () => void;
  formatDate: (dateString: string) => string;
  getContextTypeText: (contextType: string) => string;
}

export default function ReviewCard({ 
  review, 
  onPress, 
  formatDate, 
  getContextTypeText 
}: ReviewCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 mb-1">
              {getContextTypeText(review.context_type)}
            </Text>
            <Text className="text-sm text-gray-600">
              Solicitud del {formatDate(review.create_date)}
            </Text>
          </View>
          <View className="bg-orange-100 px-2 py-1 rounded-full">
            <Text className="text-orange-800 text-xs font-medium">
              Pendiente
            </Text>
          </View>
        </View>
        
        <Text className="text-gray-700 mb-4">
          Evalúa tu experiencia con el otro usuario en esta solicitud para ayudar a la comunidad.
        </Text>
        
        <Pressable
          onPress={onPress}
          className="bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center"
        >
          <FontAwesome name="edit" size={16} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-medium">
            Escribir reseña
          </Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}