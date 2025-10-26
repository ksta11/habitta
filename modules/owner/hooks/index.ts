/**
 * Barrel export para todos los hooks de propietario
 * Permite importar múltiples hooks desde un solo lugar
 * 
 * @example
 * import { useOwnerDashboard } from '../hooks';
 */

// Hooks de Dashboard
export { useOwnerDashboard } from './useOwnerDashboard';

// Hooks de Properties
export { useOwnerProperties } from './useOwnerProperties';

// Hooks de Applications
export { useOwnerApplications } from './useOwnerApplications';

// Hooks de Property Edit
export { useEditProperty } from './useEditProperty';

// Agregar aquí nuevos hooks cuando se creen:
// export { useOwnerSettings } from './useOwnerSettings';
