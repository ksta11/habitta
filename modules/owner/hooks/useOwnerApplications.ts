import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Application } from "../../../interfaces/application/ApplicationInterface";
import {
  getOwnerApplications,
  updateApplicationStatus,
} from "../../../libs/application/api-service";

interface UseOwnerApplicationsReturn {
  // Estado de aplicaciones
  applications: Application[];
  loading: boolean;
  refreshing: boolean;
  pendingApplications: Application[];

  // Handlers
  loadApplications: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleViewDetails: (application: Application) => void;
  handleRequestDocuments: (applicationId: string) => Promise<void>;
  handlePreApprove: (applicationId: string) => Promise<void>;
  handleApprove: (applicationId: string) => Promise<void>;
  handleSign: (applicationId: string) => Promise<void>;
  handleTerminate: (applicationId: string, applicantName: string) => Promise<void>;
  handleReject: (applicationId: string, applicantName: string) => void;
  handleCancel: (applicationId: string, applicantName: string) => void;
}

/**
 * 📋 Hook personalizado para manejar las aplicaciones/solicitudes del propietario
 * 
 * Encapsula toda la lógica de:
 * - Carga de aplicaciones/solicitudes
 * - Auto-refresh con useFocusEffect
 * - Pull-to-refresh
 * - Cambio de estados de aplicaciones:
 *   - pending → documents_required
 *   - pending → pre_approved
 *   - pre_approved → approved
 *   - approved → signed
 *   - signed → terminated
 *   - * → rejected
 * - Visualización de detalles
 * - Filtrado de aplicaciones pendientes
 * 
 * @returns {UseOwnerApplicationsReturn} Objeto con aplicaciones, estado y handlers
 * 
 * @example
 * ```tsx
 * const {
 *   applications,
 *   loading,
 *   refreshing,
 *   pendingApplications,
 *   handleRefresh,
 *   handleViewDetails,
 *   handlePreApprove,
 *   handleApprove,
 *   handleReject,
 * } = useOwnerApplications();
 * ```
 */
export const useOwnerApplications = (): UseOwnerApplicationsReturn => {
  // === ESTADO LOCAL ===
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // === FUNCIONES ===

  /**
   * Carga las aplicaciones del propietario desde el backend
   * - Obtiene lista de aplicaciones/solicitudes
   * - Maneja estados de loading
   * - Muestra alertas de error si es necesario
   */
  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getOwnerApplications();

      if (response.success) {
        setApplications(response.data);
        console.log("✅ Aplicaciones cargadas exitosamente");
      } else {
        console.log("❌ Error al cargar aplicaciones:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudieron cargar las aplicaciones"
        );
      }
    } catch (error) {
      console.error("💥 Error crítico al cargar aplicaciones:", error);
      Alert.alert("Error", "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el refresh manual (pull-to-refresh)
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  /**
   * Muestra los detalles de una aplicación en un Alert
   * - Muestra información del solicitante
   * - Email, teléfono, calificación
   * - Fecha y descripción de la solicitud
   */
  const handleViewDetails = (application: Application) => {
    Alert.alert(
      "Detalles de Solicitud",
      `Solicitante: ${application.renter.name}\n\nEmail: ${application.renter.email}\n\nTeléfono: ${application.renter.phone}${
        typeof application.renter.ratingAverage === "number"
          ? `\n\nCalificación: ${Math.round(application.renter.ratingAverage)}%`
          : ""
      }\n\nFecha: ${new Date(application.application_date).toLocaleDateString()}\n\nMensaje:\n"${application.description}"`,
      [{ text: "Cerrar", style: "cancel" }]
    );
  };

  /**
   * Solicita documentos al inquilino
   * - Cambia el estado a 'documents_required'
   * - Recarga la lista de aplicaciones
   */
  const handleRequestDocuments = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status: "documents_required",
        reason: "Documentos requeridos por el propietario",
      });

      if (response.success) {
        Alert.alert(
          "Documentos Solicitados",
          "Se ha solicitado documentación al inquilino.",
          [{ text: "OK" }]
        );

        await loadApplications();
      } else {
        Alert.alert(
          "Error",
          response.message || "No se pudo solicitar los documentos"
        );
      }
    } catch (error) {
      console.error("💥 Error al solicitar documentos:", error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  /**
   * Pre-aprueba una solicitud
   * - Cambia el estado a 'pre_approved'
   * - Recarga la lista de aplicaciones
   */
  const handlePreApprove = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status: "pre_approved",
        reason: "Solicitud pre-aprobada por el propietario",
      });

      if (response.success) {
        Alert.alert(
          "Solicitud Pre-aprobada",
          "¡La solicitud ha sido pre-aprobada exitosamente!",
          [{ text: "OK" }]
        );

        await loadApplications();
      } else {
        Alert.alert(
          "Error",
          response.message || "No se pudo pre-aprobar la solicitud"
        );
      }
    } catch (error) {
      console.error("💥 Error al pre-aprobar solicitud:", error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  /**
   * Aprueba definitivamente una solicitud
   * - Cambia el estado a 'approved'
   * - Recarga la lista de aplicaciones
   */
  const handleApprove = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status: "approved",
        reason: "Solicitud aprobada por el propietario",
      });

      if (response.success) {
        Alert.alert(
          "Solicitud Aprobada",
          "¡La solicitud ha sido aprobada definitivamente!",
          [{ text: "OK" }]
        );

        await loadApplications();
      } else {
        Alert.alert(
          "Error",
          response.message || "No se pudo aprobar la solicitud"
        );
      }
    } catch (error) {
      console.error("💥 Error al aprobar solicitud:", error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  /**
   * Firma el contrato de una solicitud aprobada
   * - Cambia el estado a 'signed'
   * - Recarga la lista de aplicaciones
   */
  const handleSign = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status: "signed",
        reason: "Contrato firmado",
      });

      if (response.success) {
        Alert.alert(
          "Contrato Firmado",
          "¡El contrato ha sido firmado exitosamente!",
          [{ text: "OK" }]
        );

        await loadApplications();
      } else {
        Alert.alert(
          "Error",
          response.message || "No se pudo firmar el contrato"
        );
      }
    } catch (error) {
      console.error("💥 Error al firmar contrato:", error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  /**
   * Termina un contrato firmado con confirmación
   * - Cambia el estado a 'terminated'
   * - Recarga la lista de aplicaciones
   */
  const handleTerminate = async (
    applicationId: string,
    applicantName: string
  ) => {
    Alert.alert(
      "Terminar Contrato",
      `¿Estás seguro de que quieres terminar el contrato con ${applicantName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Terminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, {
                status: "terminated",
                reason: "Contrato terminado por el propietario",
              });

              if (response.success) {
                Alert.alert(
                  "Contrato Terminado",
                  "El contrato ha sido terminado.",
                  [{ text: "OK" }]
                );

                await loadApplications();
              } else {
                Alert.alert(
                  "Error",
                  response.message || "No se pudo terminar el contrato"
                );
              }
            } catch (error) {
              console.error("💥 Error al terminar contrato:", error);
              Alert.alert("Error", "Error de conexión");
            }
          },
        },
      ]
    );
  };

  /**
   * Rechaza una solicitud con confirmación
   * - Cambia el estado a 'rejected'
   * - Recarga la lista de aplicaciones
   */
  const handleReject = (applicationId: string, applicantName: string) => {
    Alert.alert(
      "Rechazar Solicitud",
      `¿Estás seguro de que quieres rechazar la solicitud de ${applicantName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, {
                status: "rejected",
                reason: "Solicitud rechazada por el propietario",
              });

              if (response.success) {
                Alert.alert(
                  "Solicitud Rechazada",
                  "La solicitud ha sido rechazada.",
                  [{ text: "OK" }]
                );

                await loadApplications();
              } else {
                Alert.alert(
                  "Error",
                  response.message || "No se pudo rechazar la solicitud"
                );
              }
            } catch (error) {
              console.error("💥 Error al rechazar solicitud:", error);
              Alert.alert("Error", "Error de conexión");
            }
          },
        },
      ]
    );
  };

  /**
   * Cancela una pre-aprobación con confirmación
   * - Cambia el estado a 'pending'
   * - Recarga la lista de aplicaciones
   */
  const handleCancel = (applicationId: string, applicantName: string) => {
    Alert.alert(
      "Cancelar Pre-aprobación",
      `¿Estás seguro de que quieres cancelar la pre-aprobación de ${applicantName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, {
                status: "pending",
                reason: "Pre-aprobación cancelada por el propietario",
              });

              if (response.success) {
                Alert.alert(
                  "Pre-aprobación Cancelada",
                  "La pre-aprobación ha sido cancelada.",
                  [{ text: "OK" }]
                );

                await loadApplications();
              } else {
                Alert.alert(
                  "Error",
                  response.message ||
                    "No se pudo cancelar la pre-aprobación"
                );
              }
            } catch (error) {
              console.error("💥 Error al cancelar pre-aprobación:", error);
              Alert.alert("Error", "Error de conexión");
            }
          },
        },
      ]
    );
  };

  // === AUTO-REFRESH AL ENFOCAR ===
  /**
   * Cargar aplicaciones cada vez que la pantalla recibe foco
   * Esto asegura que los datos estén actualizados cuando el usuario regresa
   */
  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [])
  );

  // === DATOS COMPUTADOS ===
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  );

  // === RETURN ===
  return {
    // Estado de aplicaciones
    applications,
    loading,
    refreshing,
    pendingApplications,

    // Handlers
    loadApplications,
    handleRefresh,
    handleViewDetails,
    handleRequestDocuments,
    handlePreApprove,
    handleApprove,
    handleSign,
    handleTerminate,
    handleReject,
    handleCancel,
  };
};
