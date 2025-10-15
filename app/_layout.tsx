import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import SplashScreen from "../components/SplashScreen/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import "../global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
      RNStatusBar.setTranslucent(false);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      // Esperar al menos 2 segundos para mostrar el splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAppReady(true);
    }
    
    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isAppReady) {
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



