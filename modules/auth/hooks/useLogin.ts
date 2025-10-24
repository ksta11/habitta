import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginDTO } from '../../../interfaces/LoginInterface';
import { loginSchema } from '../../../schemes/LoginSchema';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Hook para manejar la lógica del formulario de login
 * @returns Estado y funciones para el formulario de login
 */
export const useLogin = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  /**
   * Configuración del formulario con react-hook-form
   */
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Maneja el envío del formulario de login
   */
  const onSubmit = async (data: LoginDTO) => {
    try {
      setSubmitError(null);
      console.log('📨 [useLogin] Iniciando proceso de login...');
      console.log('📧 [useLogin] Email:', data.email);

      const result = await login(data);

      if (result.success) {
        console.log('✅ [useLogin] Login exitoso');
        // La navegación se maneja automáticamente en AuthContext
        reset(); // Limpiar formulario
        return { success: true };
      } else {
        console.log('❌ [useLogin] Login fallido:', result.message);
        setSubmitError(result.message || 'Error desconocido');
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('💥 [useLogin] Error crítico:', error);
      const errorMessage = 'Error inesperado. Intenta de nuevo.';
      setSubmitError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Limpia el error de envío
   */
  const clearError = () => {
    setSubmitError(null);
  };

  /**
   * Resetea el formulario completo
   */
  const resetForm = () => {
    reset();
    setSubmitError(null);
    setShowPassword(false);
  };

  return {
    // Form control
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,

    // Estado
    submitError,
    showPassword,

    // Funciones
    togglePasswordVisibility,
    clearError,
    resetForm,
  };
};
