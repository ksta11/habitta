import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para manejar la redirección automática basada en el estado de autenticación y rol del usuario
 * 
 * Redirige a:
 * - /auth/login si no está autenticado
 * - /(admin)/home si es admin
 * - /(owner)/(home) si es owner
 * - /(user)/(home) si es user
 * 
 * @returns {Object} Estado de autenticación y loading
 */
export const useAuthRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Solo redirigir cuando ya no esté cargando
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuario autenticado, redirigir según el rol
        const redirectPath = getRedirectPathByRole(user.role);
        console.log('🔄 Usuario autenticado, redirigiendo a:', redirectPath);
        router.replace(redirectPath);
      } else {
        // Usuario no autenticado, ir al login
        console.log('🔄 Usuario no autenticado, redirigiendo a login');
        router.replace('/auth/login');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return {
    isLoading,
    isAuthenticated,
    user,
  };
};

/**
 * Determina la ruta de redirección basada en el rol del usuario
 * 
 * @param role - Rol del usuario ('admin', 'owner', 'user')
 * @returns Ruta de redirección
 */
const getRedirectPathByRole = (role: string): any => {
  switch (role) {
    case 'admin':
      return '/(admin)/home';
    case 'owner':
      return '/(owner)/(home)';
    case 'user':
    default:
      return '/(user)/(home)';
  }
};
