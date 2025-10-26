import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Property } from "../../../interfaces/property/PropertyInterface";
import {
  getOwnerProperties,
  deleteProperty,
} from "../../../libs/owner/property/api-service";
import { getOwnerStatus } from "../../../libs/owner/api-service";

interface FormattedPropertyData {
  price: string;
  address: string;
  area: string;
  bathrooms: string;
  rooms: string;
  imageUrl: string;
}

interface UseOwnerPropertiesReturn {
  // Estado de propiedades
  properties: Property[];
  loading: boolean;
  refreshing: boolean;

  // Estado de creación
  checkingStatus: boolean;
  showOptionModal: boolean;
  setShowOptionModal: (show: boolean) => void;

  // Handlers
  loadProperties: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleDeleteProperty: (propertyId: string, propertyTitle: string) => Promise<void>;
  showDeleteConfirmation: (propertyId: string, propertyTitle: string) => void;
  handleCreatePropertyPress: () => Promise<void>;
  formatPropertyData: (property: Property) => FormattedPropertyData;
  handleEditProperty: (propertyId: string, propertyTitle: string) => void;
  handleViewProperty: (propertyId: string, propertyTitle: string) => void;
}

/**
 * 🏠 Hook personalizado para manejar las propiedades del propietario
 * 
 * Encapsula toda la lógica de:
 * - Carga de propiedades del propietario
 * - Auto-refresh con useFocusEffect
 * - Pull-to-refresh
 * - Eliminación de propiedades con confirmación
 * - Creación de propiedades con verificación de estado
 * - Formateo de datos para UI
 * - Navegación a edición/detalles
 * - Manejo de modal de verificación
 * 
 * @returns {UseOwnerPropertiesReturn} Objeto con propiedades, estado y handlers
 * 
 * @example
 * ```tsx
 * const {
 *   properties,
 *   loading,
 *   refreshing,
 *   handleRefresh,
 *   handleDeleteProperty,
 *   showDeleteConfirmation,
 *   handleCreatePropertyPress,
 *   formatPropertyData,
 * } = useOwnerProperties();
 * ```
 */
export const useOwnerProperties = (): UseOwnerPropertiesReturn => {
  // === ESTADO LOCAL ===
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // === NAVEGACIÓN ===
  const router = useRouter();

  // === FUNCIONES ===

  /**
   * Carga las propiedades del propietario desde el backend
   * - Obtiene lista de propiedades
   * - Maneja estados de loading y refreshing
   * - Muestra alertas de error si es necesario
   */
  const loadProperties = async () => {
    try {
      console.log("🏠 Cargando propiedades...");
      const response = await getOwnerProperties();

      if (response.success) {
        setProperties(response.data);
        console.log(
          `✅ ${response.data.length} propiedades cargadas exitosamente`
        );
      } else {
        console.log("❌ Error al cargar propiedades:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudieron cargar las propiedades"
        );
      }
    } catch (error) {
      console.error("💥 Error crítico:", error);
      Alert.alert("Error", "Error de conexión al cargar las propiedades");
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
    await loadProperties();
  };

  /**
   * Elimina una propiedad del sistema
   * - Llama al servicio de eliminación
   * - Muestra confirmación de éxito
   * - Recarga la lista de propiedades
   */
  const handleDeleteProperty = async (
    propertyId: string,
    propertyTitle: string
  ) => {
    try {
      console.log("🗑️ Iniciando eliminación de propiedad:", propertyId);

      const response = await deleteProperty(propertyId);

      if (response.success) {
        console.log("✅ Propiedad eliminada exitosamente");
        Alert.alert(
          "Éxito",
          response.message || "La propiedad ha sido eliminada correctamente",
          [
            {
              text: "OK",
              onPress: () => loadProperties(), // Recargar la lista
            },
          ]
        );
      } else {
        console.log("❌ Error al eliminar:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudo eliminar la propiedad"
        );
      }
    } catch (error) {
      console.error("💥 Error crítico al eliminar:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la propiedad");
    }
  };

  /**
   * Muestra el Alert de confirmación para eliminar una propiedad
   */
  const showDeleteConfirmation = (
    propertyId: string,
    propertyTitle: string
  ) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar la propiedad "${propertyTitle}"?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleDeleteProperty(propertyId, propertyTitle),
        },
      ]
    );
  };

  /**
   * Maneja el proceso de creación de nueva propiedad
   * - Verifica el estado del propietario (Verified)
   * - Si está verificado, navega a formulario de creación
   * - Si no, muestra modal de verificación
   */
  const handleCreatePropertyPress = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const statusResp = await getOwnerStatus();
      if (statusResp.success && statusResp.data) {
        if (statusResp.data.status === "Verified") {
          router.push("./create/Form");
        } else {
          // Solo mostrar el OptionModal cuando la consulta haya sido exitosa
          setShowOptionModal(true);
        }
      } else {
        // Respuesta no exitosa: mostrar alerta con el mensaje
        Alert.alert(
          "Error",
          statusResp.message ||
            "No se pudo obtener el estado del propietario"
        );
      }
    } catch (err) {
      console.error("Error al consultar status del propietario:", err);
      Alert.alert(
        "Error",
        err instanceof Error
          ? err.message
          : "Error al consultar el estado del propietario"
      );
    } finally {
      setCheckingStatus(false);
    }
  }, [router]);

  /**
   * Formatea los datos de una propiedad para mostrar en el PropertyCard
   * - Formatea precio con separadores de miles
   * - Construye dirección completa
   * - Formatea área, baños y habitaciones
   * - Selecciona imagen principal o usa fallback
   */
  const formatPropertyData = (property: Property): FormattedPropertyData => {
    return {
      price: `$${property.price.toLocaleString()}`,
      address: `${property.title}, ${property.address}`,
      area: `${property.area} m²`,
      bathrooms: property.bathrooms.toString(),
      rooms: property.rooms.toString(),
      imageUrl:
        property.images && property.images.length > 0
          ? property.images[0].url_image
          : "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    };
  };

  /**
   * Navega a la pantalla de edición de propiedad
   */
  const handleEditProperty = (propertyId: string, propertyTitle: string) => {
    console.log(`Editando propiedad ${propertyId}:`, propertyTitle);
    router.push(`./edit/${propertyId}`);
  };

  /**
   * Navega a la pantalla de detalles de propiedad
   */
  const handleViewProperty = (propertyId: string, propertyTitle: string) => {
    console.log(`Propiedad ${propertyId} seleccionada:`, propertyTitle);
    // router.push(`/property/${propertyId}`);
  };

  // === CARGA INICIAL ===
  useEffect(() => {
    loadProperties();
  }, []);

  // === AUTO-REFRESH AL ENFOCAR ===
  /**
   * Recargar propiedades cada vez que la pantalla recibe foco
   * Esto asegura que los datos estén actualizados cuando el usuario regresa
   */
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Pantalla de propiedades enfocada, recargando datos...");
      loadProperties();
    }, [])
  );

  // === RETURN ===
  return {
    // Estado de propiedades
    properties,
    loading,
    refreshing,

    // Estado de creación
    checkingStatus,
    showOptionModal,
    setShowOptionModal,

    // Handlers
    loadProperties,
    handleRefresh,
    handleDeleteProperty,
    showDeleteConfirmation,
    handleCreatePropertyPress,
    formatPropertyData,
    handleEditProperty,
    handleViewProperty,
  };
};
