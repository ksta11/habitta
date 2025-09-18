# Configuración de Fuentes - Habitta

## Fuente instalada: Nunito

La aplicación Habitta ahora utiliza la fuente **Nunito** de Google Fonts como fuente principal en todas las variantes.

### Variantes disponibles:
- **Regular** (400): `Nunito_400Regular`
- **Medium** (500): `Nunito_500Medium`
- **SemiBold** (600): `Nunito_600SemiBold`
- **Bold** (700): `Nunito_700Bold`

## Formas de usar las fuentes

### 1. Con Tailwind CSS (Recomendado)

```tsx
// Usar las clases de Tailwind
<Text className="font-nunito text-lg">Texto regular</Text>
<Text className="font-nunito-medium text-xl">Texto medium</Text>
<Text className="font-nunito-semibold text-2xl">Texto semibold</Text>
<Text className="font-nunito-bold text-3xl">Texto bold</Text>

// También puedes usar las clases estándar (Nunito es la fuente por defecto)
<Text className="text-lg">Texto regular (por defecto)</Text>
<Text className="font-medium text-xl">Texto medium</Text>
<Text className="font-semibold text-2xl">Texto semibold</Text>
<Text className="font-bold text-3xl">Texto bold</Text>
```

### 2. Con StyleSheet de React Native

```tsx
import { FONT_STYLES } from '@/utils/fonts';

// Usando las constantes predefinidas
<Text style={[styles.title, FONT_STYLES.bold]}>Título</Text>
<Text style={[styles.subtitle, FONT_STYLES.semibold]}>Subtítulo</Text>
<Text style={[styles.body, FONT_STYLES.regular]}>Texto del cuerpo</Text>

// O directamente en StyleSheet
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
  },
});
```

### 3. Con constantes importadas

```tsx
import { FONTS } from '@/utils/fonts';

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
});
```

## Configuración técnica

### Archivos modificados:
- `app/_layout.tsx` - Carga de fuentes con useFonts()
- `tailwind.config.js` - Configuración de familias de fuentes
- `global.css` - Estilos globales CSS
- `utils/fonts.ts` - Constantes y helpers para fuentes

### Dependencias instaladas:
```bash
npm install --legacy-peer-deps expo-font @expo-google-fonts/nunito expo-splash-screen
```

## Mejores prácticas

1. **Usa Tailwind CSS** siempre que sea posible para mantener consistencia
2. **Fuente por defecto**: Nunito Regular se aplica automáticamente a todos los textos
3. **Jerarquía recomendada**:
   - Títulos principales: `font-nunito-bold`
   - Subtítulos: `font-nunito-semibold`
   - Textos destacados: `font-nunito-medium`
   - Texto de cuerpo: `font-nunito` (o solo usar las clases de Tailwind sin especificar fuente)

## Ejemplo completo

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function TypographyExample() {
  return (
    <View className="p-4">
      <Text className="font-nunito-bold text-3xl text-violet mb-4">
        Título Principal
      </Text>
      <Text className="font-nunito-semibold text-xl text-deep-violet mb-3">
        Subtítulo Importante
      </Text>
      <Text className="font-nunito-medium text-lg text-gray-700 mb-2">
        Texto destacado
      </Text>
      <Text className="font-nunito text-base text-gray-600">
        Este es un párrafo de texto normal usando la fuente Nunito.
        Se ve moderno y es muy legible en dispositivos móviles.
      </Text>
    </View>
  );
}
```

La configuración está completa y lista para usar en toda la aplicación! 🎉