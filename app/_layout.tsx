import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "../components/SplashScreen/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useAppInitialization } from "../hooks/useAppInitialization";
import "../global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  // Hook personalizado que maneja toda la lógica de inicialización
  const { isReady, isConnected } = useAppInitialization();

  // Mostrar splash screen mientras la app se inicializa
  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <NotificationProvider>
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
    </NotificationProvider>
  );
}