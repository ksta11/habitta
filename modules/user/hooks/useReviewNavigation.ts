import { useRouter, useSegments } from 'expo-router';
import { Review } from '../../../libs/user/review-service';

/**
 * Hook para manejar la navegación en el contexto del usuario y owner
 * Detecta automáticamente si estamos en contexto owner o user
 */
export const useReviewNavigation = () => {
  const router = useRouter();
  const segments = useSegments();

  console.log('🎯 [useReviewNavigation] Segments:', segments);

  /**
   * Detecta si estamos en contexto de owner o user
   * Busca '(owner)' en cualquier parte de los segmentos
   */
  const isOwnerContext = segments.some((segment: string) => segment === '(owner)');
  const isUserContext = segments.some((segment: string) => segment === '(user)');

  console.log('🎯 [useReviewNavigation] isOwnerContext:', isOwnerContext);
  console.log('🎯 [useReviewNavigation] isUserContext:', isUserContext);

  /**
   * Navega a una review específica
   */
  const navigateToReview = (review: Review) => {
    console.log('🚀 [useReviewNavigation] Navegando a review:', review.id);
    console.log('🚀 [useReviewNavigation] Contexto owner?', isOwnerContext);
    console.log('🚀 [useReviewNavigation] Contexto user?', isUserContext);
    
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
    console.log('📋 [useReviewNavigation] isUserContext:', isUserContext);
    console.log('📋 [useReviewNavigation] segments completos:', JSON.stringify(segments));
    
    // Determinar la ruta basándose en el contexto
    let path: string;
    if (isOwnerContext) {
      path = '/(owner)/(review)';
      console.log('📋 [useReviewNavigation] Ruta owner seleccionada:', path);
    } else if (isUserContext) {
      path = '/(user)/(review)';
      console.log('📋 [useReviewNavigation] Ruta user seleccionada:', path);
    } else {
      // Fallback: si no detecta contexto, intentar determinar por el primer segmento
      console.warn('⚠️ [useReviewNavigation] No se detectó contexto, usando fallback');
      const firstSegment = segments[0];
      if (firstSegment === '(owner)') {
        path = '/(owner)/(review)';
        console.log('📋 [useReviewNavigation] Fallback: usando ruta owner');
      } else {
        path = '/(user)/(review)';
        console.log('📋 [useReviewNavigation] Fallback: usando ruta user');
      }
    }
    
    console.log('📋 [useReviewNavigation] Ruta final calculada:', path);
    
    try {
      router.push(path as any);
      console.log('✅ [useReviewNavigation] Navegación ejecutada exitosamente');
    } catch (error) {
      console.error('❌ [useReviewNavigation] Error al navegar:', error);
      console.error('❌ [useReviewNavigation] Path intentado:', path);
    }
  };

  return {
    navigateToReview,
    navigateBack,
    navigateToReviewList,
    isOwnerContext,
    isUserContext
  };
};
