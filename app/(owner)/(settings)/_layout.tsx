import React from 'react';
import { Stack } from 'expo-router';
import HeaderBackButton from '../../../components/atoms/HeaderBackButton';

export default function SettingsLayout() {
  return (
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#531A99',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => <HeaderBackButton />,
        }}
      >
        
      <Stack.Screen
        name="index"
        options={{
          title: 'Configuración',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="upload/verifyIdentity" 
        options={{ 
          headerShown: true,
          title: 'Verificar Identidad'
        }} 
      />
      <Stack.Screen 
        name="editProfile/editProfile" 
        options={{ 
          headerShown: true,
          title: 'Editar Perfil'
        }} 
      />
      <Stack.Screen
        name="payment/viewPayments"
        options={{
          headerShown: true,
          title: 'Gestion de Pagos',
        }}
      />
      <Stack.Screen
        name="payment/make/[id]"
        options={{
          headerShown: true,
          title: 'Ventana de Pago',
        }}
      />
    </Stack>
  );
}
