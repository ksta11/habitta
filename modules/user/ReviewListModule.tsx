import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import ReviewHeader from '../../components/molecules/ReviewHeader';
import ReviewCard from '../../components/molecules/ReviewCard';
import EmptyReviews from '../../components/molecules/EmptyReviews';
import { getPendingReviewsAsAuthor, Review, debugTokenInfo } from '../../libs/user/review-service';

export default function ReviewListModule() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      console.log('🔄 Iniciando carga de reviews pendientes...');
      
      // Diagnóstico del token
      await debugTokenInfo();
      
      setLoading(true);
      const response = await getPendingReviewsAsAuthor();
      
      console.log('📋 Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('✅ Reviews cargadas exitosamente:', response.data);
        console.log('📊 Cantidad de reviews:', response.data.length);
        // El backend ya devuelve solo las reviews pendientes del usuario actual como author
        setReviews(response.data);
      } else {
        console.log('❌ Error al cargar reviews:', response.message);
        Alert.alert('Error', response.message || 'No se pudieron cargar las reviews');
      }
    } catch (error) {
      console.error('💥 Error crítico al cargar reviews:', error);
      Alert.alert('Error', 'Error al cargar las reviews pendientes');
    } finally {
      setLoading(false);
    }
  };

  const navigateToReview = (review: Review) => {
    console.log('🚀 Navegando a review con datos:', review);
    // Pasar los datos de la review como parámetros
    router.push({
      pathname: `/(user)/(review)/[reviewId]`,
      params: { 
        reviewId: review.id,
        reviewData: JSON.stringify(review)
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getContextTypeText = (contextType: string) => {
    switch (contextType) {
      case 'cancelledByTenant':
        return 'Cancelación por inquilino';
      case 'cancelledByOwner':
        return 'Cancelación por propietario';
      case 'completed':
        return 'Alquiler completado';
      default:
        return 'Pendiente de revisión';
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Cargando reviews pendientes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ReviewHeader 
        title="Reviews Pendientes" 
        onBack={() => router.back()} 
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