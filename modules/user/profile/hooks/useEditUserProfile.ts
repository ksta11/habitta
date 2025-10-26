import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useAuth } from "../../../../contexts/AuthContext";
import { beAnOwner, getCurrentUserProfile, updateCurrentUserProfile } from "../../../../libs/userServices/api-service";
import { EditUserProfileDTO, editUserProfileSchema } from "../../../../schemes/EditUserProfileSchema";

interface UseEditUserProfileReturn {
  // React Hook Form
  control: UseFormReturn<EditUserProfileDTO>["control"];
  handleSubmit: () => void;
  errors: UseFormReturn<EditUserProfileDTO>["formState"]["errors"];
  isSubmitting: boolean;

  // Estado de carga y errores
  isLoading: boolean;
  submitError: string | null;
  submitSuccess: string | null;

  // Estado de contraseña
  showPassword: boolean;
  togglePasswordVisibility: () => void;

  // Estado de Become Owner
  becomeOwnerLoading: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleBecomeOwner: () => Promise<void>;

  // Funciones auxiliares
  clearMessages: () => void;
}

/**
 * Encapsula toda la lógica de:
 * - Carga inicial del perfil actual
 * - Validación con Zod schema
 * - Estado del formulario con react-hook-form
 * - Actualización del perfil
 * - Conversión a propietario (Become Owner)
 * - Manejo de errores y éxito
 * - Integración con AuthContext
 * 
 * @returns {UseEditUserProfileReturn} Objeto con control, handlers y estado del formulario
 * 
 * @example
 * ```tsx
 * const {
 *   control,
 *   handleSubmit,
 *   errors,
 *   isSubmitting,
 *   isLoading,
 *   submitError,
 *   submitSuccess,
 *   showPassword,
 *   togglePasswordVisibility,
 *   becomeOwnerLoading,
 *   showModal,
 *   setShowModal,
 *   handleBecomeOwner,
 * } = useEditUserProfile();
 * ```
 */
export const useEditUserProfile = (): UseEditUserProfileReturn => {
  // === ESTADO LOCAL ===
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [becomeOwnerLoading, setBecomeOwnerLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // === CONTEXTO Y NAVEGACIÓN ===
  const router = useRouter();
  const { updateAuthData, updateUserData } = useAuth();

  // === REACT HOOK FORM ===
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserProfileDTO>({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  // === CARGA INICIAL DEL PERFIL ===
  useEffect(() => {
    loadUserProfile();
  }, []);

  /**
   * Carga el perfil actual del usuario y lo popula en el formulario
   */
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      console.log("📥 Cargando perfil de usuario...");

      const response = await getCurrentUserProfile();

      if (response.user.id) {
        console.log("✅ Perfil cargado:", response.user.name);
        // Cargar datos del usuario en el formulario
        setValue("name", response.user.name);
        setValue("email", response.user.email);
        setValue("phone", response.user.phone || "");
      }
    } catch (error) {
      console.error("❌ Error cargando perfil:", error);
      setSubmitError("Error al cargar el perfil del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  // === HANDLERS ===

  /**
   * Maneja el submit del formulario de actualización de perfil
   * - Limpia mensajes previos
   * - Actualiza el perfil en el servidor
   * - Actualiza el contexto de autenticación
   * - Muestra mensaje de éxito o error
   */
  const onSubmit = async (data: EditUserProfileDTO) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);

      console.log("📤 Actualizando perfil...");
      console.log("📨 Datos a enviar:", data);

      const result = await updateCurrentUserProfile(data);

      console.log("📥 Respuesta del servidor:", result);

      // Verificar si la respuesta es válida
      if (result && typeof result === "object") {
        if (result.user && result.user.id) {
          console.log("✅ Perfil actualizado exitosamente");
          setSubmitSuccess("Perfil actualizado exitosamente");

          // Actualizar los datos del usuario en el contexto
          try {
            const updatedUser = {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              phone: result.user.phone,
              role: result.user.role,
              creation_date:
                result.user.creation_date?.toString() ||
                new Date().toISOString(),
            };

            await updateUserData(updatedUser);
            console.log("✅ Datos del usuario actualizados en el contexto");
          } catch (error) {
            console.error("❌ Error actualizando contexto:", error);
          }

          // Limpiar password después de actualizar
          setValue("password", "");
        } else if (result.message) {
          console.log("❌ Error del servidor:", result.message);

          // Verificar si es un error de autenticación
          if (
            result.message.includes("sesión ha expirado") ||
            result.message.includes("Token inválido")
          ) {
            setSubmitError(
              "Tu sesión ha expirado. Serás redirigido al login..."
            );
            // El usuario será redirigido automáticamente por el servicio de API
            return;
          }

          setSubmitError(result.message);
        } else {
          console.log("❌ Respuesta inesperada del servidor");
          setSubmitError("Respuesta inesperada del servidor");
        }
      } else {
        console.log("❌ Respuesta inválida del servidor");
        setSubmitError("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error("💥 Error inesperado en actualización:", error);
      setSubmitError("Error inesperado. Intenta de nuevo.");
    }
  };

  /**
   * Wrapper del handleSubmit de react-hook-form
   * Permite usarlo directamente en el onPress del botón
   */
  const handleSubmit = () => {
    rhfHandleSubmit(onSubmit)();
  };

  /**
   * Maneja la conversión del usuario a propietario
   * - Llama al servicio beAnOwner
   * - Actualiza token y datos de usuario
   * - Redirige a la pantalla de propietario
   */
  const handleBecomeOwner = async () => {
    try {
      setBecomeOwnerLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      console.log("🏠 Intentando convertir usuario a propietario...");

      const result = await beAnOwner();

      if (result.success) {
        console.log("✅ Usuario convertido a propietario exitosamente");
        setSubmitSuccess(result.message || "Ahora eres un propietario");

        // Si la respuesta incluye un nuevo token y datos de usuario, actualizarlos
        if (result.data && result.data.token && result.data.user) {
          console.log("🔄 Actualizando token y datos de usuario...");

          // Convertir el formato de usuario del servidor al formato esperado por el contexto
          const updatedUser = {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            role: result.data.user.role,
            phone: result.data.user.phone,
            creation_date: result.data.user.creation_date,
          };

          // Actualizar token y usuario en el contexto y AsyncStorage
          await updateAuthData(result.data.token, updatedUser);

          console.log("✅ Token y usuario actualizados correctamente");
        }

        // Redirigir al home de owner después de un breve delay
        setTimeout(() => {
          router.replace("/(owner)/(properties)");
        }, 1500);
      } else {
        console.log("❌ Error al convertir usuario:", result.message);
        setSubmitError(result.message || "Error al convertir a propietario");
      }
    } catch (error) {
      console.error("💥 Error en handleBecomeOwner:", error);
      setSubmitError("Error inesperado. Intenta de nuevo.");
    } finally {
      setBecomeOwnerLoading(false);
    }
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Limpia los mensajes de error y éxito
   */
  const clearMessages = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // === RETURN ===
  return {
    // React Hook Form
    control,
    handleSubmit,
    errors,
    isSubmitting,

    // Estado de carga y errores
    isLoading,
    submitError,
    submitSuccess,

    // Estado de contraseña
    showPassword,
    togglePasswordVisibility,

    // Estado de Become Owner
    becomeOwnerLoading,
    showModal,
    setShowModal,
    handleBecomeOwner,

    // Funciones auxiliares
    clearMessages,
  };
};
