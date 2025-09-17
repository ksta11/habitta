# ImageUploader Component

Componente de React Native específico para seleccionar y capturar imágenes con límite configurable y opciones avanzadas.

## 🎯 Características

- ✅ **Cámara + Galería**: Acceso directo a cámara y biblioteca de fotos
- ✅ **Límite configurável**: 1-10 imágenes máximo
- ✅ **Edición integrada**: Crop, rotate y ajustes básicos
- ✅ **Control de calidad**: Compresión personalizable (0-1)
- ✅ **Aspectos personalizados**: Proporción de imagen configurable
- ✅ **Permisos automáticos**: Solicita permisos automáticamente
- ✅ **Títulos dinámicos**: Se generan según configuración
- ✅ **Iconos contextuales**: Cambian según la fuente (cámara/galería)

## 📦 Instalación

El componente usa `expo-image-picker` que ya está instalado en tu proyecto:

```bash
# Ya instalado en tu proyecto
expo-image-picker: "~17.0.8"
```

## 🔧 Props

| Prop | Tipo | Defecto | Descripción |
|------|------|---------|-------------|
| `onImageSelect` | `(images: ImagePickerAsset[]) => void` | - | Callback cuando se seleccionan imágenes |
| `maxImages` | `number` | `1` | Cantidad máxima de imágenes (1-10) |
| `aspectRatio` | `[number, number]` | `[4, 3]` | Proporción [ancho, alto] para edición |
| `quality` | `number` | `0.8` | Calidad de compresión (0-1) |
| `allowsEditing` | `boolean` | `true` | Permitir edición de imagen |
| `allowsMultipleSelection` | `boolean` | `true` | Selección múltiple en galería |
| `source` | `'camera' \| 'library' \| 'both'` | `'both'` | Fuente de imágenes |
| `title` | `string` | Auto-generado | Texto del botón |
| `className` | `string` | `""` | Clases CSS adicionales |
| `disabled` | `boolean` | `false` | Deshabilitar el componente |

## 🚀 Uso Básico

```tsx
import ImageUploader from './components/atoms/ImageUploader';

// Una imagen con cámara y galería
<ImageUploader 
  onImageSelect={(images) => console.log(images)}
/>

// Múltiples imágenes (máximo 5)
<ImageUploader 
  maxImages={5}
  onImageSelect={(images) => setImages(images)}
/>
```

## 📱 Casos de Uso Específicos

### 👤 Foto de Perfil (Solo Cámara)
```tsx
<ImageUploader 
  maxImages={1}
  source="camera"
  aspectRatio={[1, 1]}
  allowsEditing={true}
  title="Tomar foto de perfil"
  onImageSelect={handleProfilePhoto}
/>
```

### 🏠 Fotos de Propiedad (Múltiples)
```tsx
<ImageUploader 
  maxImages={10}
  source="both"
  aspectRatio={[4, 3]}
  quality={0.8}
  allowsEditing={false}
  title="Fotos de la propiedad"
  onImageSelect={handlePropertyPhotos}
/>
```

### 📱 Redes Sociales (Formato Cuadrado)
```tsx
<ImageUploader 
  maxImages={4}
  source="both"
  aspectRatio={[1, 1]}
  quality={0.9}
  allowsEditing={true}
  title="Fotos para redes sociales"
  onImageSelect={handleSocialPhotos}
/>
```

### 📸 Solo Galería (Alta Calidad)
```tsx
<ImageUploader 
  maxImages={3}
  source="library"
  quality={1.0}
  allowsEditing={false}
  title="Seleccionar imágenes"
  onImageSelect={handleHighQualityImages}
/>
```

## 🎨 Estilos Personalizados

```tsx
// Estilo para diferentes propósitos
<ImageUploader 
  className="border-blue-500 bg-blue-50"
  title="Imágenes importantes"
  onImageSelect={handleImages}
/>

// Tema de error
<ImageUploader 
  className="border-red-400 bg-red-50"
  disabled={hasError}
  title="Error en subida"
/>
```

## 🔍 Opciones de Fuente

### `source="camera"` - Solo Cámara
- Abre directamente la cámara
- Icono de cámara
- Ideal para fotos en tiempo real

### `source="library"` - Solo Galería
- Abre directamente la biblioteca de fotos
- Icono de galería
- Ideal para seleccionar fotos existentes

### `source="both"` - Ambas Opciones (Defecto)
- Muestra ActionSheet con opciones
- Usuario elige cámara o galería
- Máxima flexibilidad

## 📏 Proporciones de Aspecto Comunes

```tsx
// Cuadrado (1:1) - Perfil, redes sociales
aspectRatio={[1, 1]}

// Horizontal (4:3) - Fotos generales
aspectRatio={[4, 3]}

// Panorámico (16:9) - Paisajes
aspectRatio={[16, 9]}

// Vertical (3:4) - Retratos
aspectRatio={[3, 4]}
```

## 🎚️ Control de Calidad

```tsx
// Máxima calidad (archivos grandes)
quality={1.0}

// Calidad balanceada (recomendado)
quality={0.8}

// Calidad optimizada (archivos pequeños)
quality={0.5}

// Calidad mínima (preview)
quality={0.2}
```

## 🔒 Permisos

El componente maneja automáticamente:

- **Cámara**: Solicita permisos de cámara cuando es necesario
- **Galería**: Solicita permisos de biblioteca de medios
- **Alertas**: Informa al usuario si se niegan los permisos

## 🚨 Validación Automática

```tsx
// Límites automáticos
maxImages={0}   // → Se ajusta a 1
maxImages={15}  // → Se ajusta a 10

// Alertas de límite
// Si el usuario selecciona más imágenes del límite,
// se muestran solo las primeras y se alerta al usuario
```

## 📊 Información de Imagen

Las imágenes devueltas incluyen:

```tsx
interface ImagePickerAsset {
  uri: string;           // URI local de la imagen
  width: number;         // Ancho en píxeles
  height: number;        // Alto en píxeles
  fileName?: string;     // Nombre del archivo
  fileSize?: number;     // Tamaño en bytes
  mimeType?: string;     // Tipo MIME
  exif?: object;         // Datos EXIF (si están disponibles)
}
```

## 🔧 Manejo de Imágenes

```tsx
const handleImageSelect = (images: ImagePickerAsset[]) => {
  images.forEach((image, index) => {
    console.log(`Imagen ${index + 1}:`, {
      uri: image.uri,
      dimensiones: `${image.width}x${image.height}`,
      tamaño: `${(image.fileSize! / 1024 / 1024).toFixed(2)} MB`,
      tipo: image.mimeType
    });
  });
  
  // Guardar imágenes
  setSelectedImages(images);
  
  // Subir a servidor
  uploadImages(images);
};
```

## 🆚 Comparación con FileUploader

| Característica | ImageUploader | FileUploader |
|----------------|---------------|--------------|
| **Tipos soportados** | Solo imágenes | Cualquier archivo |
| **Fuentes** | Cámara + Galería | Solo archivos |
| **Edición** | ✅ Crop, rotate | ❌ |
| **Compresión** | ✅ Configurable | ❌ |
| **Vista previa** | ✅ Galería visual | ❌ Lista |
| **Permisos** | ✅ Automáticos | ✅ Sistema |
| **UX** | ✅ Optimizada para fotos | ✅ General |

## 🎯 Recomendaciones de Uso

**Usa ImageUploader cuando:**
- Necesites fotos de perfil
- Quieras galería de imágenes
- Requieras edición básica
- Necesites control de calidad
- Quieras acceso a cámara

**Usa FileUploader cuando:**
- Necesites documentos (PDF, Word, etc.)
- Quieras cualquier tipo de archivo
- No requieras edición
- Prefieras interfaz de archivos