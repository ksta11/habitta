import React from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export default function Index() {
  // Hook que maneja toda la lógica de redirección basada en autenticación
  const { isLoading } = useAuthRedirect();

  // Mostrar pantalla de carga mientras se determina la autenticación o se redirige
  return (
    <LoadingScreen 
      message={isLoading ? 'Cargando...' : 'Redirigiendo...'} 
    />
  );
}


