import { useCallback, useState } from 'react';

interface UseInputValidationProps {
  minLength?: number;
  maxLength?: number;
  initialValue?: string;
}

/**
 * Hook personalizado para validar inputs con límites mínimo y máximo
 * @param minLength - Longitud mínima permitida (default: 1)
 * @param maxLength - Longitud máxima permitida (default: 100)
 * @param initialValue - Valor inicial del input
 * @returns Objeto con el valor, función para cambiar el valor, y estado de validación
 */
export const useInputValidation = ({
  minLength = 1,
  maxLength = 100,
  initialValue = ''
}: UseInputValidationProps = {}) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Actualiza el valor del input validando los límites
   */
  const handleChange = useCallback((text: string) => {
    // Verificar límite máximo
    if (text.length > maxLength) {
      return; // No permite ingresar más caracteres
    }

    setValue(text);

    // Validar longitud mínima
    if (text.length > 0 && text.length < minLength) {
      setIsValid(false);
      setErrorMessage(`Debe tener al menos ${minLength} caracteres`);
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
  }, [minLength, maxLength]);

  /**
   * Valida el input al perder el foco
   */
  const validate = useCallback(() => {
    if (value.length < minLength) {
      setIsValid(false);
      setErrorMessage(`Debe tener al menos ${minLength} caracteres`);
      return false;
    }

    if (value.length > maxLength) {
      setIsValid(false);
      setErrorMessage(`Debe tener máximo ${maxLength} caracteres`);
      return false;
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  }, [value, minLength, maxLength]);

  /**
   * Limpia el input
   */
  const reset = useCallback(() => {
    setValue(initialValue);
    setIsValid(true);
    setErrorMessage('');
  }, [initialValue]);

  return {
    value,
    isValid,
    errorMessage,
    handleChange,
    validate,
    reset,
    setValue: handleChange,
  };
};

