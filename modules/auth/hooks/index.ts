/**
 * Barrel export para todos los hooks de autenticación
 * Permite importar múltiples hooks desde un solo lugar
 * 
 * @example
 * import { useLogin, useRegister } from '../hooks';
 */

export { useLogin } from './useLogin';
export { useRegister } from './useRegister';

// Agregar aquí nuevos hooks cuando se creen:
// export { useVerification } from './useVerification';
// export { useForgotPassword } from './useForgotPassword';
