# AlertModal y ToastNotification - Guía de Uso

## Descripción

Hemos reemplazado los `Alert.alert` nativos de React Native con componentes personalizados más atractivos y modernos que se integran mejor con el diseño de la aplicación.

## Componentes Creados

### 1. AlertModal (`components/atoms/AlertModal.tsx`)

Modal de alerta con diseño gradient y animaciones suaves, ideal para mensajes importantes que requieren confirmación del usuario.

**Características:**
- 4 tipos: `success`, `error`, `info`, `warning`
- Diseño con gradientes LinearGradient
- Iconos personalizables
- Animación fade
- Fondo semi-transparente con blur

**Props:**
```typescript
interface AlertModalProps {
  visible: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
  closeText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}
```

**Uso:**
```typescript
const [alertVisible, setAlertVisible] = useState(false);
const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');

const showAlert = (type, title, message) => {
  setAlertType(type);
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertVisible(true);
};

// En el JSX:
<AlertModal
  visible={alertVisible}
  type={alertType}
  title={alertTitle}
  message={alertMessage}
  onClose={() => setAlertVisible(false)}
  closeText="Entendido"
/>

// Llamar:
showAlert('success', '¡Éxito!', 'La operación se completó correctamente');
```

**Colores por tipo:**
- **success**: Verde (#10B981, #059669, #047857)
- **error**: Rojo (#EF4444, #DC2626, #B91C1C)
- **info**: Azul (#3B82F6, #2563EB, #1D4ED8)
- **warning**: Naranja (#F59E0B, #D97706, #B45309)

---

### 2. ToastNotification (`components/atoms/ToastNotification.tsx`)

Notificación tipo toast que aparece en la parte superior de la pantalla, se muestra brevemente y desaparece automáticamente. Ideal para confirmaciones rápidas.

**Características:**
- Animación slide down desde arriba
- Auto-hide configurable
- Diseño compacto con gradient horizontal
- 4 tipos: `success`, `error`, `info`, `warning`

**Props:**
```typescript
interface ToastNotificationProps {
  visible: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // milisegundos, default: 2500
  onHide: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}
```

**Uso:**
```typescript
const [toastVisible, setToastVisible] = useState(false);
const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
const [toastMessage, setToastMessage] = useState('');

const showToast = (type, message) => {
  setToastType(type);
  setToastMessage(message);
  setToastVisible(true);
};

// En el JSX:
<ToastNotification
  visible={toastVisible}
  type={toastType}
  message={toastMessage}
  onHide={() => setToastVisible(false)}
  duration={2500}
/>

// Llamar:
showToast('success', 'Referencia copiada al portapapeles');
```

---

## Cuándo usar cada uno

### Usar AlertModal cuando:
- ✅ El mensaje es crítico o muy importante
- ✅ Necesitas que el usuario lea y confirme
- ✅ Hay errores que requieren atención
- ✅ Confirmas una operación exitosa importante (ej: pago completado)

### Usar ToastNotification cuando:
- ✅ Es una confirmación rápida (ej: "Copiado")
- ✅ No requiere interacción del usuario
- ✅ Es información contextual breve
- ✅ Quieres mantener el flujo sin interrumpir

---

## Ejemplo de implementación en MakePayment

```typescript
// Estados
const [alertVisible, setAlertVisible] = useState(false);
const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');

const [toastVisible, setToastVisible] = useState(false);
const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
const [toastMessage, setToastMessage] = useState('');

// Helpers
const showAlert = (type, title, message) => {
  setAlertType(type);
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertVisible(true);
};

const showToast = (type, message) => {
  setToastType(type);
  setToastMessage(message);
  setToastVisible(true);
};

// Uso en handlers
const handlePayPress = async () => {
  try {
    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      showAlert('error', 'Error en el pago', presentError.message);
      return;
    }
    showAlert('success', '¡Pago exitoso!', 'Tu pago ha sido procesado correctamente');
  } catch (e) {
    showAlert('error', 'Error', 'Ocurrió un error inesperado');
  }
};

const handleCopy = async () => {
  await Clipboard.setStringAsync(reference);
  showToast('success', 'Referencia copiada al portapapeles');
};
```

---

## Ventajas sobre Alert.alert nativo

1. **Diseño consistente**: Se integra perfectamente con el estilo visual de la app
2. **Mejor UX**: Animaciones suaves y colores distintivos
3. **Personalizable**: Iconos y textos completamente configurables
4. **Toast para acciones rápidas**: No bloquea el flujo para confirmaciones menores
5. **Gradientes atractivos**: Usa los mismos colores que el resto de la app
6. **Responsive**: Se adapta a diferentes tamaños de pantalla

---

## Captura de pantalla del diseño

```
┌─────────────────────────────────┐
│  🌟 AlertModal (Success)        │
│  ┌───────────────────────────┐  │
│  │  ┌─────┐                  │  │
│  │  │  ✓  │ [Icono grande]   │  │
│  │  └─────┘                  │  │
│  │                           │  │
│  │  ¡Pago exitoso!           │  │
│  │                           │  │
│  │  Tu pago ha sido          │  │
│  │  procesado correctamente  │  │
│  │                           │  │
│  │    [Entendido]            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ✅ Referencia copiada  ← Toast │
└─────────────────────────────────┘
```
