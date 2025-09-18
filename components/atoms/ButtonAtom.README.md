# ButtonAtom Component

Un componente de botón moderno y versátil para aplicaciones React Native móviles.

## Características

- ✅ **7 Variantes de color** - primary, secondary, success, danger, warning, outline, ghost
- ✅ **3 Tamaños** - small, medium, large
- ✅ **Estados** - normal, disabled, loading
- ✅ **Iconos** - Soporte para iconos de Ionicons con posición configurable
- ✅ **Responsive** - Opción de ancho completo
- ✅ **Accesible** - Estados visuales claros y feedback táctil
- ✅ **Customizable** - Props de estilo personalizables

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | - | **Requerido.** Texto del botón |
| `onPress` | `() => void` | - | **Requerido.** Función que se ejecuta al presionar |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning' \| 'outline' \| 'ghost'` | `'primary'` | Variante de color del botón |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Si el botón está deshabilitado |
| `loading` | `boolean` | `false` | Si el botón muestra estado de carga |
| `icon` | `keyof typeof Ionicons.glyphMap` | - | Icono de Ionicons a mostrar |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del icono |
| `fullWidth` | `boolean` | `false` | Si el botón ocupa todo el ancho disponible |
| `style` | `object` | `{}` | Estilos personalizados adicionales |

## Ejemplos de Uso

### Básico
```tsx
import ButtonAtom from '../components/atoms/ButtonAtom';

<ButtonAtom
  title="Guardar"
  onPress={() => console.log('Guardado')}
/>
```

### Con Variantes
```tsx
// Botón principal
<ButtonAtom
  title="Continuar"
  onPress={handleContinue}
  variant="primary"
/>

// Botón de éxito
<ButtonAtom
  title="Crear"
  onPress={handleCreate}
  variant="success"
/>

// Botón de peligro
<ButtonAtom
  title="Eliminar"
  onPress={handleDelete}
  variant="danger"
/>

// Botón outline
<ButtonAtom
  title="Cancelar"
  onPress={handleCancel}
  variant="outline"
/>
```

### Con Iconos
```tsx
// Icono a la izquierda
<ButtonAtom
  title="Guardar"
  onPress={handleSave}
  icon="save-outline"
  iconPosition="left"
  variant="success"
/>

// Icono a la derecha
<ButtonAtom
  title="Siguiente"
  onPress={handleNext}
  icon="arrow-forward-outline"
  iconPosition="right"
/>
```

### Diferentes Tamaños
```tsx
<ButtonAtom
  title="Pequeño"
  onPress={handleSmall}
  size="small"
/>

<ButtonAtom
  title="Mediano"
  onPress={handleMedium}
  size="medium"
/>

<ButtonAtom
  title="Grande"
  onPress={handleLarge}
  size="large"
/>
```

### Estados Especiales
```tsx
// Deshabilitado
<ButtonAtom
  title="No disponible"
  onPress={handleDisabled}
  disabled={true}
/>

// Cargando
<ButtonAtom
  title="Procesando"
  onPress={handleLoading}
  loading={true}
/>

// Ancho completo
<ButtonAtom
  title="Continuar"
  onPress={handleFullWidth}
  fullWidth={true}
/>
```

### Casos de Uso Comunes en la App

#### Formularios
```tsx
// Botón principal de envío
<ButtonAtom
  title="Guardar Propiedad"
  onPress={handleSubmit}
  variant="primary"
  size="large"
  fullWidth={true}
  loading={isSubmitting}
  disabled={!isValid}
/>

// Botón de cancelar
<ButtonAtom
  title="Cancelar"
  onPress={handleCancel}
  variant="outline"
  size="large"
  fullWidth={true}
/>
```

#### Navegación
```tsx
// Botón de continuar
<ButtonAtom
  title="Siguiente Paso"
  onPress={nextStep}
  icon="arrow-forward-outline"
  iconPosition="right"
  variant="primary"
/>

// Botón de regresar
<ButtonAtom
  title="Atrás"
  onPress={prevStep}
  icon="arrow-back-outline"
  iconPosition="left"
  variant="outline"
/>
```

#### Acciones de CRUD
```tsx
// Crear
<ButtonAtom
  title="Nueva Propiedad"
  onPress={createProperty}
  icon="add-outline"
  variant="success"
/>

// Editar
<ButtonAtom
  title="Editar"
  onPress={editProperty}
  icon="create-outline"
  variant="primary"
/>

// Eliminar
<ButtonAtom
  title="Eliminar"
  onPress={deleteProperty}
  icon="trash-outline"
  variant="danger"
/>
```

## Colores

### Variantes Disponibles

- **primary**: `#8B5CF6` (morado) - Para acciones principales
- **secondary**: `#6B7280` (gris) - Para acciones secundarias
- **success**: `#10B981` (verde) - Para acciones positivas
- **danger**: `#EF4444` (rojo) - Para acciones destructivas
- **warning**: `#F59E0B` (amarillo) - Para advertencias
- **outline**: Transparente con borde morado - Para botones alternativos
- **ghost**: Transparente sin borde - Para acciones sutiles

## Tamaños

- **small**: 36px altura, padding 8x16, texto 14px
- **medium**: 48px altura, padding 12x24, texto 16px
- **large**: 56px altura, padding 16x32, texto 18px

## Dependencias

- `react-native`
- `@expo/vector-icons` (para los iconos)

## Notas de Diseño

- Los botones tienen bordes redondeados para un look moderno
- El estado de hover está implementado con `activeOpacity={0.8}`
- Los estados disabled y loading tienen 60% de opacidad
- Los iconos se escalan automáticamente según el tamaño del botón
- El componente es completamente customizable a través de la prop `style`