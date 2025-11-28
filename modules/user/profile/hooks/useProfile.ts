import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import { getCurrentUserProfile } from "../../../../libs/userServices/api-service";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  creation_date: string;
}

interface UseProfileReturn {
  // Estado del perfil
  profileData: UserProfileData | null;
  loading: boolean;
  refreshing: boolean;
  lastUpdated: Date | null;

  // Datos formateados para UI
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  displayRole: string;
  userInitial: string;

  // Handlers
  handleRefresh: () => Promise<void>;
  handleLogout: () => void;
  navigateToEditProfile: () => void;
}

/**
 * 
 * Encapsula toda la lógica de:
 * - Carga automática del perfil al enfocar la pantalla (useFocusEffect)
 * - Refresh manual con pull-to-refresh
 * - Actualización del contexto de autenticación
 * - Formateo de datos para la UI
 * - Navegación a edición de perfil
 * - Logout con confirmación
 * - Manejo de errores y sesiones expiradas
 * 
 * @returns {UseProfileReturn} Objeto con datos del perfil, estado y handlers
 * 
 * @example
 * ```tsx
 * const {
 *   profileData,
 *   loading,
 *   refreshing,
 *   displayName,
 *   displayEmail,
 *   handleRefresh,
 *   handleLogout,
 * } = useProfile();
 * ```
 */
export const useProfile = (): UseProfileReturn => {
  // === ESTADO LOCAL ===
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // === CONTEXTO Y NAVEGACIÓN ===
  const { user, logout, updateUserData } = useAuth();
  const router = useRouter();

  // === FUNCIONES ===

  /**
   * Carga el perfil del usuario desde el backend
   * - Obtiene datos actualizados del servidor
   * - Actualiza el contexto de autenticación
   * - Maneja errores de sesión expirada
   */
  const loadUserProfile = async () => {
    try {
      console.log("📥 Cargando perfil desde el backend...");
      const response = await getCurrentUserProfile();

      if (response.user && response.user.id) {
        // Los datos ya vienen en el formato correcto del backend
        const userData: UserProfileData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          creation_date: response.user.creation_date.toString(),
        };

        console.log("✅ Datos obtenidos del backend:", userData);

        // Actualizar los datos del contexto y del estado local
        await updateUserData(userData);
        setProfileData(userData);
        setLastUpdated(new Date());

        console.log("✅ Perfil actualizado exitosamente");
      } else {
        console.log("❌ Error al cargar perfil:", response.message);
        if (
          response.message &&
          response.message.includes("Tu sesión ha expirado")
        ) {
          Alert.alert("Sesión Expirada", response.message);
        } else {
          Alert.alert(
            "Error",
            response.message || "No se pudieron cargar los datos del perfil"
          );
        }
      }
    } catch (error) {
      console.error("💥 Error crítico:", error);
      Alert.alert("Error", "Error de conexión al cargar el perfil");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Maneja el refresh manual (pull-to-refresh)
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
  };

  /**
   * Maneja el logout con confirmación
   * - Muestra Alert de confirmación
   * - Ejecuta logout del contexto
   */
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  /**
   * Navega a la pantalla de edición de perfil
   */
  const navigateToEditProfile = () => {
    router.push("/(user)/(settings)/editProfile");
  };

  // === CARGA AUTOMÁTICA AL ENFOCAR ===
  /**
   * Cargar perfil cada vez que la pantalla recibe foco
   * Esto asegura que los datos estén actualizados cuando el usuario regresa
   */
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Pantalla de perfil enfocada, cargando datos del backend...");
      setLoading(true);
      loadUserProfile();
    }, [])
  );

  // === DATOS FORMATEADOS PARA UI ===
  // Usar profileData primero, luego user como fallback
  const currentData = profileData || user;
  
  const displayName = currentData?.name || "";
  const displayEmail = currentData?.email || "";
  const displayPhone = currentData?.phone || "";
  const displayRole = currentData?.role || "user";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Debug logs
  console.log("👤 Datos del usuario en useProfile:", currentData);
  console.log("👤 Usuario name:", displayName);
  console.log("👤 Usuario email:", displayEmail);
  console.log("👤 Usuario phone:", displayPhone);

  // === RETURN ===
  return {
    // Estado del perfil
    profileData,
    loading,
    refreshing,
    lastUpdated,

    // Datos formateados para UI
    displayName,
    displayEmail,
    displayPhone,
    displayRole,
    userInitial,

    // Handlers
    handleRefresh,
    handleLogout,
    navigateToEditProfile,
  };
};
