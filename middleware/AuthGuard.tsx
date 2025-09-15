import React, { useEffect, ReactNode } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { isTokenExpired } from '../utils/Tokens';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin' | 'owner';
}

/**
 * Componente simple para proteger rutas
 * Solo verifica autenticación y rol básico
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    // Verificar si el token ha expirado al montar el componente
    if (!isLoading && isAuthenticated && token && isTokenExpired(token)) {
      console.log('🚨 Token expirado detectado en AuthGuard - cerrando sesión');
      logout();
      return;
    }
  }, [isLoading, isAuthenticated, token, logout]);

  useEffect(() => {
    // Verificar rol si es requerido - mover a useEffect para evitar setState during render
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      let correctRoute = '/(user)/home'; // Default for user role
      
      if (user?.role === 'admin') {
        correctRoute = '/(admin)/home';
      } else if (user?.role === 'owner') {
        correctRoute = '/(owner)/property'; // Corregir ruta para owner
      }
      
      router.replace(correctRoute);
    }
  }, [isLoading, isAuthenticated, requiredRole, user?.role]);

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

  // Si el rol no coincide, no mostrar nada (se redirige)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Todo OK, mostrar contenido
  return <>{children}</>;
}
