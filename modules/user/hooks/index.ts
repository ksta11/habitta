/**
 * Barrel export para todos los hooks de usuario
 * Permite importar múltiples hooks desde un solo lugar
 * 
 * @example
 * import { useReviews, useReviewNavigation } from '../hooks';
 */

// Hooks de Reviews
export { useReviews } from './useReviews';
export { useReviewNavigation } from './useReviewNavigation';

// Hooks de Properties
export { useProperties } from './useProperties';
export { usePropertyFilters } from './usePropertyFilters';
export type { PropertyFilters } from './usePropertyFilters';
export { useFavorites } from './useFavorites';
export { usePropertyNavigation } from './usePropertyNavigation';

// Agregar aquí nuevos hooks cuando se creen:
// export { useApplications } from './useApplications';
// export { useProfile } from './useProfile';

