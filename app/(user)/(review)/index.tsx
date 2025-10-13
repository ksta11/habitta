import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Card, CardContent } from '../../../components/atoms/Card';
import { getPendingReviewsAsAuthor, Review, debugTokenInfo } from '../../../libs/user/review-service';

export default function ReviewList() {
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
      <View className="flex-row items-center gap-4 px-6 py-4 border-b border-gray-200">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <FontAwesome name="arrow-left" size={20} color="#374151" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">Reviews Pendientes</Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {reviews.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <FontAwesome name="star-o" size={64} color="#D1D5DB" />
            <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
              No tienes reviews pendientes
            </Text>
            <Text className="text-gray-500 mt-2 text-center px-4">
              Cuando tengas solicitudes aparecerán aquí para que puedas evaluar a otros usuarios.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Tienes {reviews.length} review{reviews.length > 1 ? 's' : ''} pendiente{reviews.length > 1 ? 's' : ''}
            </Text>
            
            {reviews.map((review) => (
              <Card key={review.id} className="border border-gray-200">
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
                    onPress={() => navigateToReview(review)}
                    className="bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center"
                  >
                    <FontAwesome name="edit" size={16} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-medium">
                      Escribir reseña
                    </Text>
                  </Pressable>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}