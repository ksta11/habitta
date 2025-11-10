import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../../../../libs/userServices/api-service';
import { EditUserProfileDTO } from '../../../../schemes/EditUserProfileSchema';
import { hapticFeedback } from '../../../../utils/haptics';

interface UseEditUserProfileReturn {
  isLoading: boolean;
  submitError: string | null;
  submitSuccess: string | null;
  loadUserProfile: () => Promise<any | null>;
  submitProfile: (data: EditUserProfileDTO) => Promise<any>;
}

export const useEditUserProfile = (): UseEditUserProfileReturn => {
  const { updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCurrentUserProfile();
      if (response && response.user && response.user.id) {
        return response.user;
      } else {
        const msg = response?.message || 'No se pudo cargar el perfil';
        hapticFeedback.error();
        setSubmitError(msg);
        Alert.alert('Error', msg);
        return null;
      }
    } catch (err: any) {
      console.error('Error cargando perfil:', err);
      const msg = err?.message || 'Error al cargar el perfil';
      hapticFeedback.error();
      setSubmitError(msg);
      Alert.alert('Error', msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitProfile = async (data: EditUserProfileDTO) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);
      setIsLoading(true);

      const result = await updateCurrentUserProfile(data as any);

      if (result && typeof result === 'object') {
        if (result.user && result.user.id) {
          hapticFeedback.success();
          setSubmitSuccess('Perfil actualizado exitosamente');
          // Update auth context
          try {
            const updatedUser = {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              phone: result.user.phone,
              role: result.user.role,
              creation_date: result.user.creation_date?.toString() || new Date().toISOString(),
            };
            await updateUserData(updatedUser);
          } catch (err) {
            console.error('Error actualizando contexto:', err);
          }
          return result;
        } else if (result.message) {
          hapticFeedback.error();
          setSubmitError(result.message);
          return result;
        }
      }
      hapticFeedback.error();
      setSubmitError('Respuesta inválida del servidor');
      return { success: false, message: 'Respuesta inválida del servidor' };
    } catch (err: any) {
      console.error('Error en submitProfile:', err);
      hapticFeedback.error();
      setSubmitError(err?.message || 'Error inesperado');
      return { success: false, message: err?.message || 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitError,
    submitSuccess,
    loadUserProfile,
    submitProfile,
  };
};

export default useEditUserProfile;
