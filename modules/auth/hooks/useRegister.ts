import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { RegisterSchema } from "../../../schemes/RegisterSchema";
import { RegisterFormDTO } from "../../../interfaces/RegisterInterface";
import { useAuth } from "../../../contexts/AuthContext";
import { hapticFeedback } from "../../../utils/haptics";

interface UseRegisterReturn {
  // React Hook Form
  control: UseFormReturn<RegisterFormDTO>["control"];
  handleSubmit: () => void;
  errors: UseFormReturn<RegisterFormDTO>["formState"]["errors"];
  isSubmitting: boolean;

  // Estado de errores
  submitError: string | null;

  // Estado de contraseñas
  showPassword: boolean;
  showRepeatPassword: boolean;

  // Funciones auxiliares
  togglePasswordVisibility: () => void;
  toggleRepeatPasswordVisibility: () => void;
  clearError: () => void;
  resetForm: () => void;
}

/**
 * 🔐 Hook personalizado para manejar el formulario de registro
 * 
 * Encapsula toda la lógica de:
 * - Validación con Zod schema
 * - Estado del formulario con react-hook-form
 * - Visibilidad de contraseñas (password y repeatPassword)
 * - Manejo de errores de submit
 * - Integración con AuthContext
 * - Alert de éxito/error
 * 
 * @returns {UseRegisterReturn} Objeto con control, handlers y estado del formulario
 * 
 * @example
 * ```tsx
 * const {
 *   control,
 *   handleSubmit,
 *   errors,
 *   isSubmitting,
 *   submitError,
 *   showPassword,
 *   showRepeatPassword,
 *   togglePasswordVisibility,
 *   toggleRepeatPasswordVisibility,
 * } = useRegister();
 * ```
 */
export const useRegister = (): UseRegisterReturn => {
  // === ESTADO LOCAL ===
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // === CONTEXTO ===
  const { register } = useAuth();

  // === REACT HOOK FORM ===
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // === HANDLERS ===

  /**
   * Maneja el submit del formulario
   * - Limpia errores previos
   * - Llama al registro del contexto
   * - Muestra Alert de éxito o error
   * - Navega automáticamente si es exitoso (manejado en AuthContext)
   */
  const onSubmit = async (data: RegisterFormDTO) => {
    try {
      setSubmitError(null);

      console.log("📝 Iniciando proceso de registro...");
      console.log("📨 Datos:", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        acceptTerms: data.acceptTerms,
      });

      const result = await register(data);

      if (result.success) {
        console.log("✅ Registro exitoso");
        // Feedback háptico de éxito
        hapticFeedback.success();
        Alert.alert(
          "Registro exitoso",
          result.message || "Tu cuenta ha sido creada correctamente"
        );
        // La navegación se maneja automáticamente en el AuthContext
      } else {
        console.log("❌ Registro fallido:", result.message);
        // Feedback háptico de error
        hapticFeedback.error();
        setSubmitError(result.message || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("💥 Error inesperado en registro:", error);
      // Feedback háptico de error
      hapticFeedback.error();
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
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = () => {
    // Feedback háptico sutil al cambiar visibilidad
    hapticFeedback.selection();
    setShowPassword((prev) => !prev);
  };

  /**
   * Alterna la visibilidad de la contraseña de confirmación
   */
  const toggleRepeatPasswordVisibility = () => {
    // Feedback háptico sutil al cambiar visibilidad
    hapticFeedback.selection();
    setShowRepeatPassword((prev) => !prev);
  };

  /**
   * Limpia el error de submit
   */
  const clearError = () => {
    setSubmitError(null);
  };

  /**
   * Resetea el formulario a valores por defecto
   */
  const resetForm = () => {
    reset();
    setSubmitError(null);
    setShowPassword(false);
    setShowRepeatPassword(false);
  };

  // === RETURN ===
  return {
    // React Hook Form
    control,
    handleSubmit,
    errors,
    isSubmitting,

    // Estado de errores
    submitError,

    // Estado de contraseñas
    showPassword,
    showRepeatPassword,

    // Funciones auxiliares
    togglePasswordVisibility,
    toggleRepeatPasswordVisibility,
    clearError,
    resetForm,
  };
};
