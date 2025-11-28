import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  getPendingReviewsAsAuthor, 
  Review, 
  debugTokenInfo,
  updateReview,
  UpdateReviewData
} from '../../../libs/user/review-service';

/**
 * Hook para manejar la lógica de reviews
 * @returns Estado y funciones para manejar reviews
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga las reviews pendientes del usuario
   */
  const loadPendingReviews = async () => {
    try {
      console.log('🔄 [useReviews] Iniciando carga de reviews pendientes...');
      
      // Diagnóstico del token
      await debugTokenInfo();
      
      setLoading(true);
      setError(null);
      
      const response = await getPendingReviewsAsAuthor();
      
      console.log('📋 [useReviews] Respuesta del servicio:', response);
      
      if (response.success) {
        console.log('✅ [useReviews] Reviews cargadas exitosamente:', response.data.length);
        setReviews(response.data);
      } else {
        console.log('❌ [useReviews] Error al cargar reviews:', response.message);
        setError(response.message || 'No se pudieron cargar las reviews');
        Alert.alert('Error', response.message || 'No se pudieron cargar las reviews');
      }
    } catch (err) {
      console.error('💥 [useReviews] Error crítico:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      Alert.alert('Error', 'Error al cargar las reviews pendientes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una review con comentario
   */
  const submitReview = async (reviewId: string, data: UpdateReviewData) => {
    try {
      console.log('📤 [useReviews] Enviando review:', reviewId, data);
      
      const response = await updateReview(reviewId, data);
      
      if (response.success) {
        console.log('✅ [useReviews] Review actualizada exitosamente');
        // Recargar la lista de reviews
        await loadPendingReviews();
        return { success: true };
      } else {
        console.log('❌ [useReviews] Error al actualizar review:', response.message);
        Alert.alert('Error', response.message || 'No se pudo actualizar la review');
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('💥 [useReviews] Error al enviar review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      Alert.alert('Error', 'Error al enviar la review');
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Formatea una fecha a formato legible
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  /**
   * Obtiene el texto del tipo de contexto
   */
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

  // Cargar reviews al montar el componente
  useEffect(() => {
    loadPendingReviews();
  }, []);

  return {
    // Estado
    reviews,
    loading,
    error,
    
    // Funciones
    loadPendingReviews,
    submitReview,
    refetch: loadPendingReviews,
    
    // Utilidades
    formatDate,
    getContextTypeText
  };
};
