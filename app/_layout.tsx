import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pantalla principal */}
      <Stack.Screen name="index" />
      
      {/* Rutas de autenticación directas */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      
      {/* Grupo de autenticación (mantener para compatibilidad) */}
      <Stack.Screen 
        name="auth" 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Rutas protegidas */}
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="doctor" />
    </Stack>
  );
}



