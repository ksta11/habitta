/**
 * Utilidades para Haptic Feedback
 * Centraliza todas las funciones de feedback háptico de la aplicación
 */

import * as Haptics from 'expo-haptics';

/**
 * Tipos de feedback háptico disponibles
 */
export enum HapticType {
  // Impactos - Para botones y acciones
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  
  // Notificaciones - Para mensajes y alertas
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  
  // Selección - Para pickers, switches, tabs
  Selection = 'selection',
}

/**
 * Ejecuta un feedback háptico de impacto
 * Ideal para: botones, cards clickeables, acciones táctiles
 */
export const triggerImpact = async (
  style: 'light' | 'medium' | 'heavy' = 'medium'
): Promise<void> => {
  try {
    switch (style) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Ejecuta un feedback háptico de notificación
 * Ideal para: mensajes de éxito, errores, advertencias
 */
export const triggerNotification = async (
  type: 'success' | 'warning' | 'error' = 'success'
): Promise<void> => {
  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Ejecuta un feedback háptico sutil de selección
 * Ideal para: tabs, switches, pickers, sliders
 */
export const triggerSelection = async (): Promise<void> => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Ejecuta un feedback háptico general basado en el tipo
 */
export const triggerHaptic = async (type: HapticType): Promise<void> => {
  switch (type) {
    case HapticType.Light:
      return triggerImpact('light');
    case HapticType.Medium:
      return triggerImpact('medium');
    case HapticType.Heavy:
      return triggerImpact('heavy');
    case HapticType.Success:
      return triggerNotification('success');
    case HapticType.Warning:
      return triggerNotification('warning');
    case HapticType.Error:
      return triggerNotification('error');
    case HapticType.Selection:
      return triggerSelection();
    default:
      return triggerImpact('medium');
  }
};

/**
 * Feedback háptico para acciones de usuario comunes
 */
export const hapticFeedback = {
  // Acciones de botones
  buttonPress: () => triggerImpact('medium'),
  buttonPressLight: () => triggerImpact('light'),
  buttonPressHeavy: () => triggerImpact('heavy'),
  
  // Notificaciones
  success: () => triggerNotification('success'),
  warning: () => triggerNotification('warning'),
  error: () => triggerNotification('error'),
  
  // Interacciones
  selection: () => triggerSelection(),
  tabChange: () => triggerSelection(),
  toggleSwitch: () => triggerSelection(),
  
  // Acciones específicas
  delete: () => triggerNotification('warning'),
  refresh: () => triggerImpact('light'),
  save: () => triggerNotification('success'),
  cancel: () => triggerImpact('light'),
};

/**
 * Hook personalizado para usar haptics en componentes
 * Ejemplo de uso:
 * 
 * const haptics = useHaptics();
 * 
 * <Button onPress={() => {
 *   haptics.buttonPress();
 *   // tu lógica aquí
 * }} />
 */
export const useHaptics = () => {
  return hapticFeedback;
};
