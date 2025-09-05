import React, { useEffect, ReactNode } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

/**
 * Componente simple para proteger rutas
 * Solo verifica autenticación y rol básico
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated]);

  // Mostrar loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 16 }}>Verificando...</Text>
      </View>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role !== requiredRole) {
    const correctRoute = user?.role === 'admin' ? '/(admin)/home' : '/(user)/home';
    router.replace(correctRoute);
    return null;
  }

  // Todo OK, mostrar contenido
  return <>{children}</>;
}
