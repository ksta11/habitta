import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import NetInfo from '@react-native-community/netinfo';
import { useFonts } from "expo-font";
import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Platform, StatusBar as RNStatusBar } from "react-native";
import SplashScreen from "../components/SplashScreen/SplashScreen";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
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
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const [isAppReady, setIsAppReady] = useState(false);

  const [connect, setConnect] = useState<boolean | undefined>(true);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
      RNStatusBar.setTranslucent(false);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      await ExpoSplashScreen.preventAutoHideAsync();
    }
    
    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);


  useEffect(() => {
    const checkConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setConnect(netInfoState.isConnected ?? false);
      if (netInfoState.isConnected === false) {
        Alert.alert("Sin conexión", "No tienes conexión a internet. Algunas funciones pueden no estar disponibles.");
      }
    };
    
    checkConnection();

    // Suscribirse a cambios de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnect(state.isConnected ?? false);
      if (state.isConnected === false) {
        Alert.alert("Sin conexión", "No tienes conexión a internet. Algunas funciones pueden no estar disponibles.");
      }
    });

    // Cleanup al desmontar
    return () => {
      unsubscribe();
    };
  }, []);
  
  if (!fontsLoaded || !isAppReady) {
    return <SplashScreen onAnimationFinish={() => setIsAppReady(true)} />;
  }
  
  if (!fontsLoaded) {
    return null;
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