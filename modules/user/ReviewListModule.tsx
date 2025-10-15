import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import ReviewHeader from '../../components/molecules/ReviewHeader';
import ReviewCard from '../../components/molecules/ReviewCard';
import EmptyReviews from '../../components/molecules/EmptyReviews';
import { getPendingReviewsAsAuthor, Review, debugTokenInfo } from '../../libs/user/review-service';

export default function ReviewListModule() {
  const router = useRouter();
  const segments = useSegments();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('🎯 [ReviewListModule] Componente inicializado');
  console.log('🎯 [ReviewListModule] Segments:', segments);

  useEffect(() => {
    console.log('🎯 [ReviewListModule] useEffect ejecutándose...');
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      console.log('🔄 [ReviewListModule] Iniciando carga de reviews pendientes...');
      console.log('🔄 [ReviewListModule] Estado actual de loading:', loading);
      
      // Diagnóstico del token
      console.log('🔍 [ReviewListModule] Ejecutando diagnóstico del token...');
      await debugTokenInfo();
      
      setLoading(true);
      console.log('🔄 [ReviewListModule] Loading establecido a true, llamando servicio...');
      
      const response = await getPendingReviewsAsAuthor();
      
      console.log('📋 [ReviewListModule] Respuesta completa del servicio:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ [ReviewListModule] Reviews cargadas exitosamente:', response.data);
        console.log('📊 [ReviewListModule] Cantidad de reviews:', response.data.length);
        console.log('📊 [ReviewListModule] Datos de cada review:', response.data.map(r => ({ id: r.id, status: r.status, context_type: r.context_type })));
        
        setReviews(response.data);
      } else {
        console.log('❌ [ReviewListModule] Error al cargar reviews:', response.message);
        console.log('❌ [ReviewListModule] Respuesta de error completa:', response);
        Alert.alert('Error', response.message || 'No se pudieron cargar las reviews');
      }
    } catch (error) {
      console.error('💥 [ReviewListModule] Error crítico al cargar reviews:', error);
      console.error('💥 [ReviewListModule] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      Alert.alert('Error', 'Error al cargar las reviews pendientes');
    } finally {
      console.log('🏁 [ReviewListModule] Finalizando carga, estableciendo loading a false...');
      setLoading(false);
    }
  };

  const navigateToReview = (review: Review) => {
    console.log('🚀 [ReviewListModule] Navegando a review con datos:', review);
    console.log('🚀 [ReviewListModule] Review ID:', review.id);
    console.log('🚀 [ReviewListModule] Segments disponibles:', segments);
    
    // Detectar el contexto actual usando segments
    const isOwnerContext = segments.some((segment: string) => segment === '(owner)');
    console.log('🚀 [ReviewListModule] Es contexto owner?', isOwnerContext);
    
    let targetPath: string;
    if (isOwnerContext) {
      targetPath = `/(owner)/(review)/${review.id}`;
      console.log('🚀 [ReviewListModule] Contexto owner detectado, usando:', targetPath);
    } else {
      targetPath = `/(user)/(review)/${review.id}`;
      console.log('🚀 [ReviewListModule] Contexto user detectado, usando:', targetPath);
    }
    
    // Pasar los datos de la review como parámetros
    router.push({
      pathname: targetPath,
      params: { 
        reviewId: review.id,
        reviewData: JSON.stringify(review)
      }
    } as any);
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
          <ActivityIndicator size="large" color="#531A99" />
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