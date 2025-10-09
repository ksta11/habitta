# FileUploader Component

Componente de React Native para seleccionar archivos con límite configurable de documentos.

## Características

- ✅ Soporte para 1-10 archivos máximo
- ✅ Filtrado por tipo de archivo (MIME types)
- ✅ Títulos dinámicos automáticos
- ✅ Estado deshabilitado
- ✅ Estilos personalizables con NativeWind
- ✅ Validación automática de límites
- ✅ Alertas de usuario informativas

## Instalación

Asegúrate de tener instaladas las dependencias:

```bash
npm install expo-document-picker react-native-svg
```

## Props

| Prop | Tipo | Defecto | Descripción |
|------|------|---------|-------------|
| `onFileSelect` | `(files: DocumentPickerAsset[]) => void` | - | Callback cuando se seleccionan archivos |
| `maxFiles` | `number` | `1` | Cantidad máxima de archivos (1-10) |
| `acceptedTypes` | `string[]` | `['*/*']` | Tipos MIME aceptados |
| `title` | `string` | Auto-generado | Texto del botón |
| `className` | `string` | `""` | Clases CSS adicionales |
| `disabled` | `boolean` | `false` | Deshabilitar el componente |

## Uso Básico

```tsx
import FileUploader from './components/atoms/FileUploader';

// Un archivo
<FileUploader 
  onFileSelect={(files) => console.log(files)}
/>

// Múltiples archivos (máximo 5)
<FileUploader 
  maxFiles={5}
  onFileSelect={(files) => console.log(files)}
/>
```

## Ejemplos Específicos

### Solo Imágenes (máximo 3)
```tsx
<FileUploader 
  maxFiles={3}
  acceptedTypes={['image/*']}
  onFileSelect={handleImages}
/>
```

### Solo PDFs (máximo 2)
```tsx
<FileUploader 
  maxFiles={2}
  acceptedTypes={['application/pdf']}
  title="Seleccionar PDFs"
  onFileSelect={handlePDFs}
/>
```

### Con Estilos Personalizados
```tsx
<FileUploader 
  maxFiles={4}
  className="border-blue-500 bg-blue-50"
  onFileSelect={handleFiles}
/>
```

### Estado Deshabilitado
```tsx
<FileUploader 
  disabled={true}
  title="Carga no disponible"
  onFileSelect={handleFiles}
/>
```

## Validación Automática

El componente valida automáticamente:

- **Límite mínimo**: Si `maxFiles < 1`, se ajusta a 1
- **Límite máximo**: Si `maxFiles > 10`, se ajusta a 10
- **Selección excesiva**: Si el usuario selecciona más archivos del límite, se muestra una alerta y se toman solo los primeros archivos hasta el límite

## Títulos Automáticos

Si no especificas un `title`, el componente genera automáticamente:

- `maxFiles = 1`: "Seleccionar archivo"
- `maxFiles > 1`: "Seleccionar hasta X archivos"

## Tipos de Archivo Comunes

```tsx
// Cualquier archivo
acceptedTypes={['*/*']}

// Solo imágenes
acceptedTypes={['image/*']}

// Solo PDFs
acceptedTypes={['application/pdf']}

// Imágenes y PDFs
acceptedTypes={['image/*', 'application/pdf']}

// Documentos específicos
acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
```

## Manejo de Archivos Seleccionados

```tsx
const handleFileSelect = (files: DocumentPickerAsset[]) => {
  files.forEach((file, index) => {
    console.log(`Archivo ${index + 1}:`, {
      nombre: file.name,
      tamaño: file.size,
      tipo: file.mimeType,
      uri: file.uri
    });
  });
};
```

## Notas Importantes

1. **Límite de archivos**: El rango válido es 1-10 archivos
2. **Dependencias**: Requiere `expo-document-picker` y `react-native-svg`
3. **Plataforma**: Compatible con iOS y Android
4. **Almacenamiento**: Los archivos se copian al cache de la app automáticamente