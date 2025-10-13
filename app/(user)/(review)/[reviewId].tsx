import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Card, CardContent } from '../../../components/atoms/Card';
import { getReview, updateReview, Review, debugTokenInfo } from '../../../libs/user/review-service';
import { getUserById } from '../../../libs/userServices/api-service';
import { UserDAO } from '../../../interfaces/UserInterface';

interface ReviewData {
  comment: string;
}

export default function UserReview() {
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

  // Obtener información del usuario receptor
  const getUserDisplayInfo = () => {
    if (receiverUser && receiverUser.user) {
      const user = receiverUser.user;
      // Generar iniciales del nombre
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
      };

      return {
        name: user.name || "Usuario Desconocido",
        initials: user.name ? getInitials(user.name) : "U", 
        role: user.role === 'owner' ? 'Propietario' : user.role === 'user' ? 'Inquilino' : 'Usuario',
        totalReviews: 0, // Podrías obtener esto de otra API si está disponible
        rating: 0, // Podrías obtener esto de otra API si está disponible
      };
    }
    
    // Fallback mientras se cargan los datos
    return {
      name: "Cargando...",
      initials: "...", 
      role: "Usuario",
      totalReviews: 0,
      rating: 0,
    };
  };

  const userInfo = getUserDisplayInfo();

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
      <View className="flex-row items-center gap-4 px-6 py-4 border-b border-gray-200">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <FontAwesome name="arrow-left" size={20} color="#374151" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">Dejar reseña</Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* User Info */}
        <Card className="mb-6 bg-blue-50 border-0">
          <CardContent className="p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xl">{userInfo.initials}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">{userInfo.name}</Text>
                <Text className="text-sm text-gray-600">{userInfo.role}</Text>
                {/* Comentar temporalmente hasta tener la información de reviews */}
                {/* <View className="flex-row items-center gap-1 mt-1">
                  <FontAwesome name="star" size={12} color="#FBBF24" />
                  <Text className="text-sm font-medium text-gray-700">{userInfo.rating}</Text>
                  <Text className="text-sm text-gray-500">• {userInfo.totalReviews} reseñas</Text>
                </View> */}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Comment */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Cuéntanos tu experiencia</Text>
          <View className="bg-blue-50 rounded-lg border border-gray-200">
            <TextInput
              placeholder="Comparte los detalles de tu experiencia con este usuario. Tu opinión ayuda a otros miembros de la comunidad..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={8}
              className="p-4 text-gray-800"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>
          <Text className="text-sm text-gray-500 mt-2">{comment.length} caracteres</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Submit */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <Pressable
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
          className={`w-full h-12 rounded-full items-center justify-center flex-row ${
            isFormValid && !submitting ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
          ) : (
            <FontAwesome 
              name="send" 
              size={16} 
              color={isFormValid ? "white" : "#9CA3AF"} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text className={`font-medium ${isFormValid && !submitting ? 'text-white' : 'text-gray-500'}`}>
            {submitting ? 'Enviando...' : 'Publicar reseña'}
          </Text>
        </Pressable>
        {!isFormValid && !submitting && (
          <Text className="text-sm text-gray-500 text-center mt-2">
            Escribe tu reseña para publicarla
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}