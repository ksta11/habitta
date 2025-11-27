import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import NetInfo from '@react-native-community/netinfo';
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Alert, Platform, StatusBar as RNStatusBar } from "react-native";

/**
 * Hook personalizado para inicializar la aplicación
 * Maneja: carga de fuentes, splash screen, configuración de status bar y conexión a internet
 * 
 * @returns {Object} Estado de inicialización de la app
 */
export const useAppInitialization = () => {
  // Estado de carga de fuentes
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  // Estado de preparación de la app
  const [isAppReady, setIsAppReady] = useState(false);

  // Estado de conexión a internet
  const [isConnected, setIsConnected] = useState<boolean | undefined>(true);

  /**
   * Configurar el status bar para iOS
   */
  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNStatusBar.setBackgroundColor('#7C3AED', true);
      RNStatusBar.setBarStyle('light-content', true);
      RNStatusBar.setTranslucent(false);
    }
  }, []);

  /**
   * Esperar a que las fuentes se carguen y mostrar splash screen
   */
  useEffect(() => {
    async function prepare() {
      try {
        // Esperar al menos 2 segundos para mostrar el splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsAppReady(true);
      } catch (error) {
        console.error('Error al preparar la app:', error);
        setIsAppReady(true); // Continuar aunque haya error
      }
    }
    
    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  /**
   * Verificar conexión a internet
   */
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected ?? false);
        
        if (netInfoState.isConnected === false) {
          Alert.alert(
            "Sin conexión", 
            "No tienes conexión a internet. Algunas funciones pueden no estar disponibles."
          );
        }
      } catch (error) {
        console.error('Error al verificar conexión:', error);
      }
    };
    
    // Verificar conexión inicial
    checkConnection();

    // Suscribirse a cambios de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      
      if (state.isConnected === false) {
        Alert.alert(
          "Sin conexión", 
          "No tienes conexión a internet. Algunas funciones pueden no estar disponibles."
        );
      }
    });

    // Cleanup al desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    // Estados
    fontsLoaded,
    isAppReady,
    isConnected,
    
    // Estado combinado para determinar si la app está lista
    isReady: fontsLoaded && isAppReady,
  };
};
