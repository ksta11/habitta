/**
 * Barrel export para todos los hooks de usuario
 * Permite importar múltiples hooks desde un solo lugar
 * 
 * @example
 * import { useReviews, useReviewNavigation } from '../hooks';
 */

// Hooks de Reviews
export { useReviewNavigation } from './useReviewNavigation';
export { useReviews } from './useReviews';

// Hooks de Properties
export { useFavorites } from './useFavorites';
export { useProperties } from './useProperties';
export { usePropertyFilters } from './usePropertyFilters';
export type { PropertyFilters } from './usePropertyFilters';
export { usePropertyNavigation } from './usePropertyNavigation';

// Hooks de Profile
export { useEditUserProfile } from '../profile/hooks/useEditUserProfile';
export { useProfile } from '../profile/hooks/useProfile';

// Agregar aquí nuevos hooks cuando se creen:
// export { useApplications } from './useApplications';
// export { useUserSettings } from './useUserSettings';

