import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderBackButtonProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
  /**
   * Si true, no renderiza el botón cuando no existe historial hacia atrás.
   */
  hideIfCannotGoBack?: boolean;
  onPress?: () => void;
}

export default function HeaderBackButton({
  color = '#fff',
  size = 24,
  style,
  hideIfCannotGoBack = true,
  onPress,
}: HeaderBackButtonProps) {
  const router = useRouter();

  // router.canGoBack puede no existir dependiendo de la versión; proteger la llamada
  const canGoBack = typeof router.canGoBack === 'function' ? router.canGoBack() : true;

  if (hideIfCannotGoBack && !canGoBack) return null;

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={[{ paddingHorizontal: 12 }, style]}
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
}
