import { useRouter, useSegments } from 'expo-router';
import { Review } from '../../../libs/user/review-service';

/**
 * Hook para manejar la navegación en el contexto del usuario
 * Detecta automáticamente si estamos en contexto owner o user
 */
export const useReviewNavigation = () => {
  const router = useRouter();
  const segments = useSegments();

  console.log('🎯 [useReviewNavigation] Segments:', segments);

  /**
   * Detecta si estamos en contexto de owner o user
   */
  const isOwnerContext = segments.some((segment: string) => segment === '(owner)');

  /**
   * Navega a una review específica
   */
  const navigateToReview = (review: Review) => {
    console.log('🚀 [useReviewNavigation] Navegando a review:', review.id);
    console.log('🚀 [useReviewNavigation] Contexto owner?', isOwnerContext);
    
    let targetPath: string;
    if (isOwnerContext) {
      targetPath = `/(owner)/(review)/${review.id}`;
      console.log('🚀 [useReviewNavigation] Usando ruta owner:', targetPath);
    } else {
      targetPath = `/(user)/(review)/${review.id}`;
      console.log('🚀 [useReviewNavigation] Usando ruta user:', targetPath);
    }
    
    router.push({
      pathname: targetPath,
      params: { 
        reviewId: review.id,
        reviewData: JSON.stringify(review)
      }
    } as any);
  };

  /**
   * Navega hacia atrás
   */
  const navigateBack = () => {
    console.log('🔙 [useReviewNavigation] Navegando hacia atrás');
    router.back();
  };

  /**
   * Navega a la lista de reviews
   */
  const navigateToReviewList = () => {
    console.log('📋 [useReviewNavigation] Navegando a lista de reviews');
    console.log('📋 [useReviewNavigation] isOwnerContext:', isOwnerContext);
    console.log('📋 [useReviewNavigation] segments:', segments);
    
    // Usar ruta completa con /index para asegurar navegación correcta
    const path = isOwnerContext ? '/(owner)/(review)/index' : '/(user)/(review)/index';
    console.log('📋 [useReviewNavigation] Ruta calculada:', path);
    
    try {
      router.push(path as any);
      console.log('✅ [useReviewNavigation] Navegación ejecutada exitosamente');
    } catch (error) {
      console.error('❌ [useReviewNavigation] Error al navegar:', error);
    }
  };

  return {
    navigateToReview,
    navigateBack,
    navigateToReviewList,
    isOwnerContext
  };
};
