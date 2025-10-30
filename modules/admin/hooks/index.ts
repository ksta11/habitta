/**
 * Barrel export para todos los hooks de administrador
 * Permite importar múltiples hooks desde un solo lugar
 * 
 * @example
 * import { usePendingIdentityDocuments, useUsers } from '../hooks';
 */

// Hooks de Documentos de Identidad
export { usePendingIdentityDocuments } from './usePendingIdentityDocuments';

// Hooks de Usuarios
export { useUsers, type User } from './useUsers';

// Hooks de Gestión de Propiedades
export { usePropertiesManagement } from './usePropertiesManagement';

// Hooks de Solicitudes
export { useSolicitudes } from './useSolicitudes';

// Agregar aquí nuevos hooks cuando se creen:
// export { useAdminStats } from './useAdminStats';
// export { useUsersManagement } from './useUsersManagement';
