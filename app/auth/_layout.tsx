import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerTransparent: true, // Hace el header transparente
        headerTitle: '', // Sin título
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: '', // Sin título para que no se vea texto
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerTransparent: false, // Asegurar que no sea transparente para el color
          headerBackVisible: false, // Ocultar el botón de back nativo
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: '', // Sin título para que no se vea texto
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerTransparent: false, // Asegurar que no sea transparente para el color
          headerBackVisible: false, // Ocultar el botón de back nativo
        }}
      />
    </Stack>
  );
}
