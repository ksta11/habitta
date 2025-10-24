import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import EmptyReviews from '../../../components/molecules/EmptyReviews';
import ReviewCard from '../../../components/molecules/ReviewCard';
import { useReviewNavigation, useReviews } from '../hooks';
import ReviewHeader from './molecules/ReviewHeader';

/**
 * Módulo de lista de reviews
 * Muestra todas las reviews pendientes del usuario
 * 
 * Este módulo usa hooks para separar la lógica de la UI:
 * - useReviews: Maneja el estado y la lógica de reviews
 * - useReviewNavigation: Maneja la navegación según el contexto
 */
export default function ReviewListModule() {
  // Hooks personalizados
  const { 
    reviews, 
    loading, 
    formatDate, 
    getContextTypeText 
  } = useReviews();
  
  const { 
    navigateToReview, 
    navigateBack 
  } = useReviewNavigation();

  // Estado de carga
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#531A99" />
          <Text className="text-gray-600 mt-4">Cargando reviews pendientes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // UI Principal
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ReviewHeader 
        title="Reviews Pendientes" 
        onBack={navigateBack} 
      />

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {reviews.length === 0 ? (
          <EmptyReviews
            title="No tienes reviews pendientes"
            description="Cuando tengas solicitudes aparecerán aquí para que puedas evaluar a otros usuarios."
            icon="star-o"
          />
        ) : (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Tienes {reviews.length} review{reviews.length > 1 ? 's' : ''} pendiente{reviews.length > 1 ? 's' : ''}
            </Text>
            
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onPress={() => navigateToReview(review)}
                formatDate={formatDate}
                getContextTypeText={getContextTypeText}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
