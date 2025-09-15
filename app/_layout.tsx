import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StatusBar as RNStatusBar, Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
      RNStatusBar.setTranslucent(false);
    }
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#7C3AED" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pantalla principal */}
        <Stack.Screen name="index" />
        
        {/* Grupo de autenticación */}
        <Stack.Screen 
          name="auth" 
          options={{
            headerShown: false,
          }}
        />
        
        {/* Rutas protegidas */}
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(owner)" />
      </Stack>
    </AuthProvider>
  );
}



