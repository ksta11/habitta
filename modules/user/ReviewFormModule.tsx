import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import ReviewCommentInput from '../../components/molecules/ReviewCommentInput';
import ReviewHeader from '../../components/molecules/ReviewHeader';
import ReviewSubmitButton from '../../components/molecules/ReviewSubmitButton';
import UserInfoCard from '../../components/molecules/UserInfoCard';
import { UserDAO } from '../../interfaces/UserInterface';
import { Review, debugTokenInfo, getReview, updateReview } from '../../libs/user/review-service';
import { getUserById } from '../../libs/userServices/api-service';

export default function ReviewFormModule() {
  const router = useRouter();
  const { reviewId, reviewData } = useLocalSearchParams<{ 
    reviewId: string; 
    reviewData?: string; 
  }>();
  
  const [comment, setComment] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [receiverUser, setReceiverUser] = useState<UserDAO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // recommended: true => recomendado, false => no recomendado
  const [recommended, setRecommended] = useState<boolean | null>(true);

  // Cargar datos de la review al montar el componente
  useEffect(() => {
    if (reviewData) {
      // Si tenemos datos pasados, usarlos directamente
      try {
        const parsedReview = JSON.parse(reviewData);
        console.log('📋 Usando datos de review pasados:', parsedReview);
        setReview(parsedReview);
        if (parsedReview.comment) {
          setComment(parsedReview.comment);
        }
        // Cargar información del usuario receptor
        if (parsedReview.id_receiver) {
          loadReceiverUserInfo(parsedReview.id_receiver);
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al parsear datos de review:', error);
        // Si hay error, cargar desde el backend
        loadReviewData();
      }
    } else if (reviewId) {
      // Si no hay datos pasados, cargar desde el backend
      loadReviewData();
    } else {
      setLoading(false);
    }
  }, [reviewId, reviewData]);

  const loadReceiverUserInfo = async (receiverId: string) => {
    try {
      console.log('👤 Cargando información del usuario receptor:', receiverId);
      const userResponse = await getUserById(receiverId);
      
      if (userResponse.user && userResponse.user.id) {
        console.log('✅ Usuario receptor cargado:', userResponse.user);
        setReceiverUser(userResponse);
      } else {
        console.log('❌ No se pudo cargar la información del usuario receptor:', userResponse.message);
      }
    } catch (error) {
      console.error('💥 Error al cargar información del usuario receptor:', error);
    }
  };

  const loadReviewData = async () => {
    if (!reviewId) {
      console.log('❌ No hay reviewId disponible');
      return;
    }
    
    try {
      console.log('🔄 Cargando datos de review:', reviewId);
      setLoading(true);
      const response = await getReview(reviewId);
      
      console.log('📋 Respuesta del servicio getReview:', response);
      
      if (response.success && response.data) {
        console.log('✅ Review cargada exitosamente:', response.data);
        setReview(response.data);
        // Si ya tiene comentario, mostrarlo
        if (response.data.comment) {
          console.log('📝 Review ya tiene comentario:', response.data.comment);
          setComment(response.data.comment);
        }
        // Cargar información del usuario receptor
        if (response.data.id_receiver) {
          loadReceiverUserInfo(response.data.id_receiver);
        }
      } else {
        console.log('❌ Error al cargar review:', response.message);
        Alert.alert('Error', response.message || 'No se pudo cargar la información de la review');
        router.back();
      }
    } catch (error) {
      console.error('💥 Error crítico al cargar review:', error);
      Alert.alert('Error', 'Error al cargar los datos');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewId) {
      Alert.alert('Error', 'No se encontró la información de la review');
      return;
    }

    try {
      console.log('🔄 Iniciando envío de review...');
      console.log('📝 Review ID:', reviewId);
      console.log('📝 Review data completa:', review);
      
      // Verificar token antes de enviar
      await debugTokenInfo();
      
      setSubmitting(true);
      
      const reviewData = {
        comment: comment.trim(),
        // pass recommended boolean explicitly so backend receives true/false
        rating: typeof recommended === 'boolean' ? recommended : undefined,
      };
      
      console.log('📤 Datos a enviar:', reviewData);
      
      const response = await updateReview(reviewId, reviewData);
      
      if (response.success) {
        Alert.alert(
          "Reseña enviada",
          "Tu reseña ha sido publicada exitosamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'No se pudo enviar la reseña');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = comment.trim().length > 0;

  if (loading || (review && !receiverUser)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <ReviewHeader 
        title="Dejar reseña" 
        onBack={() => router.back()} 
      />

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* User Info */}
        <UserInfoCard receiverUser={receiverUser} />

        {/* Recommended toggle */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">¿Recomendarías a este usuario?</Text>
          <View className="flex-row items-center">
            <Switch value={!!recommended} onValueChange={(v) => setRecommended(v)} />
            <Text className="ml-3 text-sm text-gray-700">{recommended ? 'Recomendado' : 'No recomendado'}</Text>
          </View>
        </View>

        {/* Comment Input */}
        <ReviewCommentInput
          comment={comment}
          onCommentChange={setComment}
        />
      </ScrollView>

      {/* Fixed Bottom Submit */}
      <ReviewSubmitButton
        onSubmit={handleSubmit}
        isValid={isFormValid}
        isSubmitting={submitting}
      />
    </SafeAreaView>
  );
}