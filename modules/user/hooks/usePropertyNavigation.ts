import { useRouter, useSegments } from 'expo-router';
import { Property } from '../../../interfaces/property/PropertyInterface';

/**
 * Hook para manejar la navegación a detalles de propiedades
 * Detecta el contexto (user/owner) y navega a la ruta correcta
 * @returns Funciones de navegación
 */
export const usePropertyNavigation = () => {
  const router = useRouter();
  const segments = useSegments();

  /**
   * Detecta el contexto actual (user u owner)
   */
  const getCurrentContext = (): 'user' | 'owner' | 'unknown' => {
    const segmentString = segments.join('/');
    console.log('🧭 [usePropertyNavigation] Segmentos actuales:', segmentString);

    if (segmentString.includes('(owner)')) {
      return 'owner';
    } else if (segmentString.includes('(user)')) {
      return 'user';
    }

    return 'unknown';
  };

  /**
   * Navega a los detalles de una propiedad según el contexto
   */
  const navigateToProperty = (propertyId: string) => {
    const context = getCurrentContext();
    console.log(`🏠 [usePropertyNavigation] Navegando a propiedad ${propertyId} en contexto ${context}`);

    if (context === 'owner') {
      router.push(`/(owner)/(properties)/${propertyId}` as any);
    } else {
      // Por defecto, navegar al contexto de usuario
      router.push(`/(user)/(home)/${propertyId}` as any);
    }
  };

  /**
   * Navega a los detalles de una propiedad usando el objeto completo
   */
  const navigateToPropertyDetails = (property: Property) => {
    navigateToProperty(property.id);
  };

  /**
   * Navega de regreso a la lista de propiedades
   */
  const navigateBack = () => {
    const context = getCurrentContext();
    console.log(`⬅️ [usePropertyNavigation] Navegando atrás desde contexto ${context}`);

    if (router.canGoBack()) {
      router.back();
    } else {
      // Si no hay historial, ir al home del contexto correspondiente
      if (context === 'owner') {
        router.replace('/(owner)/home' as any);
      } else {
        router.replace('/(user)/home' as any);
      }
    }
  };

  /**
   * Navega a la búsqueda/filtros de propiedades
   */
  const navigateToSearch = () => {
    const context = getCurrentContext();
    console.log(`🔍 [usePropertyNavigation] Navegando a búsqueda en contexto ${context}`);

    if (context === 'owner') {
      router.push('/(owner)/home' as any);
    } else {
      router.push('/(user)/home' as any);
    }
  };

  return {
    // Funciones de navegación
    navigateToProperty,
    navigateToPropertyDetails,
    navigateBack,
    navigateToSearch,

    // Utilidades
    getCurrentContext,
  };
};
