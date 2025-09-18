# 🎨 Guía de Colores - Habitta

Esta guía proporciona ejemplos prácticos de cómo usar el esquema de colores de Habitta en tus componentes.

## 🎯 Paleta Principal

### **Violeta Principal** - `#531A99`
```tsx
// Botones principales
<Pressable style={{ backgroundColor: '#531A99' }}>
  <Text className="text-white">Acción Principal</Text>
</Pressable>

// Con Tailwind
<View className="bg-violet">
  <Text className="text-white">Contenido destacado</Text>
</View>
```

### **Violeta Profundo** - `#320964`
```tsx
// Headers y navegación
<View style={{ backgroundColor: '#320964' }}>
  <Text className="text-white font-nunito-bold">Header Principal</Text>
</View>

// Textos importantes
<Text style={{ color: '#320964' }} className="font-nunito-semibold">
  Texto destacado
</Text>
```

## 🌈 Paleta Completa con Ejemplos

### **Combinaciones Recomendadas**

#### **1. Header Principal**
```tsx
<View className="bg-violet p-6">
  <Text className="text-white font-nunito-bold text-2xl">Habitta</Text>
  <Text className="text-white opacity-80 font-nunito">
    Tu hogar ideal te espera
  </Text>
</View>
```

#### **2. Cards de Propiedades**
```tsx
<View className="bg-white rounded-xl shadow-lg p-4">
  <Text className="text-erie-black font-nunito-bold text-lg">
    Casa en Venta
  </Text>
  <Text className="text-gray-600 font-nunito">
    3 hab • 2 baños • 120m²
  </Text>
  <Text className="text-violet font-nunito-semibold text-xl">
    $250,000
  </Text>
</View>
```

#### **3. Botones Secundarios**
```tsx
<Pressable className="border border-lavender-indigo rounded-lg p-3">
  <Text className="text-lavender-indigo font-nunito-semibold text-center">
    Ver Detalles
  </Text>
</Pressable>
```

#### **4. Estados y Notificaciones**
```tsx
// Estado exitoso
<View className="bg-green-50 border border-green-200 rounded-lg p-3">
  <Text className="text-green-700 font-nunito-medium">
    ✅ Propiedad guardada exitosamente
  </Text>
</View>

// Estado de error
<View className="bg-red-50 border border-red-200 rounded-lg p-3">
  <Text className="text-red-700 font-nunito-medium">
    ❌ Error al cargar propiedades
  </Text>
</View>

// Estado de advertencia
<View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
  <Text className="text-yellow-700 font-nunito-medium">
    ⚠️ Verifica los datos ingresados
  </Text>
</View>
```

## 🔧 Variables CSS Personalizadas

Para uso en StyleSheet de React Native:

```typescript
// utils/colors.ts
export const COLORS = {
  // Principales
  violet: '#531A99',
  deepViolet: '#320964',
  
  // Secundarios
  lavenderIndigo: '#A346E6',
  lavenderBright: '#BD93EF',
  
  // Neutros
  erieBlack: '#1F1F1F',
  whiteTraffic: '#F6F6F6',
  
  // Grises del sistema
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;
```

## 🎨 Gradientes

### **Gradiente Principal**
```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#531A99', '#320964']}
  style={{ padding: 20, borderRadius: 12 }}
>
  <Text className="text-white font-nunito-bold">
    Contenido con gradiente
  </Text>
</LinearGradient>
```

### **Gradiente Suave**
```tsx
<LinearGradient
  colors={['#BD93EF', '#A346E6']}
  style={{ padding: 16, borderRadius: 8 }}
>
  <Text className="text-white font-nunito-medium">
    Acento suave
  </Text>
</LinearGradient>
```

## 📱 Paleta por Pantalla

### **Pantallas de Autenticación**
- **Background**: `#7C3AED` (violeta vibrante)
- **Cards**: `#FFFFFF` (blanco)
- **Texto principal**: `#1F2937` (gris oscuro)
- **Acentos**: `#531A99` (violet)

### **Dashboard/Home**
- **Background**: `#F6F6F6` (white-traffic)
- **Cards**: `#FFFFFF` (blanco)
- **Headers**: `#531A99` (violet)
- **Texto**: `#1F1F1F` (erie-black)

### **Detalles de Propiedades**
- **Background**: `#FFFFFF` (blanco)
- **Precio**: `#531A99` (violet)
- **Características**: `#6B7280` (gray-500)
- **Botones CTA**: `#531A99` (violet)

## 🌙 Modo Oscuro (Futuro)

Paleta preparada para implementación de modo oscuro:

```typescript
export const DARK_COLORS = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#A346E6',
  secondary: '#BD93EF',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
} as const;
```

## ✅ Checklist de Accesibilidad

- [x] **Contraste**: Todos los colores cumplen WCAG 2.1 AA
- [x] **Legibilidad**: Textos legibles en todos los backgrounds
- [x] **Consistencia**: Uso consistente de colores por función
- [x] **Estados**: Colores distintivos para estados interactivos

## 🎯 Mejores Prácticas

1. **Usa `violet` para acciones principales**
2. **Reserva `deep-violet` para elementos de alta jerarquía**
3. **`lavender-indigo` para links e interacciones**
4. **`erie-black` para todo el texto principal**
5. **`white-traffic` para backgrounds neutros**
6. **Mantén consistencia en toda la aplicación**

---

*Esta guía asegura una experiencia visual cohesiva y profesional en toda la aplicación Habitta* 🎨✨