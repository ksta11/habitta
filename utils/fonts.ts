// Configuración global de fuentes para Habitta
export const FONTS = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
} as const;

// Estilos de texto predefinidos para usar en React Native
export const FONT_STYLES = {
  regular: {
    fontFamily: FONTS.regular,
  },
  medium: {
    fontFamily: FONTS.medium,
  },
  semibold: {
    fontFamily: FONTS.semibold,
  },
  bold: {
    fontFamily: FONTS.bold,
  },
} as const;

// Helpers para usar con Tailwind CSS
export const TAILWIND_FONTS = {
  regular: 'font-nunito',
  medium: 'font-nunito-medium',
  semibold: 'font-nunito-semibold',
  bold: 'font-nunito-bold',
} as const;