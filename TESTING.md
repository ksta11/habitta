# 🧪 Testing en Habitta

Este proyecto utiliza **Jest** y **React Native Testing Library** para unit testing.

## ✅ Estado Actual

- **52 tests** pasando exitosamente
- **8 suites de tests** implementados
- Cobertura en componentes, hooks, utilidades y schemas

## 📦 Dependencias Instaladas

- `jest` - Framework de testing
- `@testing-library/react-native` - Testing utilities para React Native
- `jest-expo` - Preset de Jest para Expo
- `react-test-renderer` - Renderizador para tests
- `@types/jest` - Tipos de TypeScript para Jest

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Limpiar caché de Jest
npm run test:clear
```

## ⚙️ Configuración

### Archivos de Configuración

- **`jest.config.js`**: Configuración principal de Jest con preset de jest-expo
- **`jest.polyfills.js`**: Polyfills y mocks iniciales para Expo SDK 54 (se carga ANTES del preset)
- **`jest.setup.js`**: Mocks globales para módulos de Expo (se carga DESPUÉS del preset)
- **`__mocks__/`**: Mocks manuales para assets y módulos

### Nota sobre Expo SDK 54

Este proyecto usa Expo SDK 54 que incluye el nuevo "Winter" runtime. Para que Jest funcione correctamente, se necesitan configuraciones especiales:

1. **`jest.polyfills.js`** se carga antes del preset para:
   - Mockear `__ExpoImportMetaRegistry`
   - Agregar polyfills para `TextEncoder`, `TextDecoder`, `structuredClone`
   - Deshabilitar el runtime Winter durante las pruebas

2. **`jest.setup.js`** se carga después para configurar mocks de módulos de Expo

## 📁 Estructura de Tests

```
__tests__/
├── components/        # Tests de componentes
│   └── ButtonAtom.test.tsx
├── hooks/            # Tests de hooks personalizados
│   └── useAuth.test.ts
└── utils/            # Tests de utilidades
    └── format.test.ts
```

## ✍️ Escribir Tests

### Test de Componente

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonAtom from '../../components/atoms/ButtonAtom';

describe('ButtonAtom', () => {
  it('debe renderizar correctamente', () => {
    const { getByText } = render(
      <ButtonAtom title="Test" onPress={() => {}} />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('debe ejecutar onPress', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ButtonAtom title="Click" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
```

### Test de Hook

```typescript
import { renderHook } from '@testing-library/react-native';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

describe('useAuth', () => {
  it('debe retornar user null sin sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});
```

### Test de Utilidad

```typescript
import { formatCurrency } from '../../utils/format';

describe('formatCurrency', () => {
  it('debe formatear moneda correctamente', () => {
    expect(formatCurrency(1000)).toContain('1');
  });
});
```

## 🎯 Buenas Prácticas

### 1. **Nombre de archivos**
- Usar `.test.tsx` o `.test.ts` como sufijo
- Colocar en carpeta `__tests__` o junto al archivo

### 2. **Organización**
```typescript
describe('NombreComponente', () => {
  // Tests del comportamiento normal
  it('debe renderizar correctamente', () => {});
  
  // Tests de interacciones
  it('debe manejar click', () => {});
  
  // Tests de edge cases
  it('debe manejar props undefined', () => {});
});
```

### 3. **Mocks**
- Mockear módulos externos (AsyncStorage, expo-router)
- Mockear llamadas API
- Usar `jest.fn()` para callbacks

### 4. **Assertions**
```typescript
// Existen elementos
expect(element).toBeTruthy();
expect(element).toBeNull();

// Valores
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toContain('text');

// Funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

## 🔧 Configuración

### jest.config.js
Configuración principal de Jest con preset `jest-expo`.

### jest.setup.js
- Mocks globales (AsyncStorage, expo-router, etc.)
- Configuración de Testing Library
- Timeout global

### __mocks__/
- `fileMock.js` - Mock para assets (imágenes, etc.)
- `styleMock.js` - Mock para CSS/estilos

## 📊 Cobertura de Código

Ejecutar:
```bash
npm run test:coverage
```

Esto genera un reporte en `coverage/` mostrando:
- % de líneas cubiertas
- % de funciones cubiertas
- % de branches cubiertas
- % de statements cubiertas

## 🐛 Debugging

### Ver output detallado
```bash
npm test -- --verbose
```

### Ejecutar un test específico
```bash
npm test -- ButtonAtom
```

### Actualizar snapshots
```bash
npm test -- -u
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎬 Ejemplos de Tests

Revisa los tests en `__tests__/` para ver ejemplos de:
- Tests de componentes con eventos
- Tests de hooks con estado
- Tests de funciones utilitarias
- Tests con async/await
- Tests con mocks

## 📋 Tests Implementados (52 total)

### Utilidades (11 tests)
- ✅ `format.test.ts` - formatCurrency, formatPlanPrice (11 casos)
- ✅ `validation.test.ts` - TEXT_ALLOWED_REGEX, textField (10 casos)

### Componentes (18 tests)
- ✅ `ButtonAtom.test.tsx` - Renderizado, eventos, estados (5 casos)
- ✅ `Badge.test.tsx` - Variantes y renderizado (6 casos)
- ✅ `Label.test.tsx` - Tamaños, pesos, variantes (7 casos)

### Hooks (9 tests)
- ✅ `useAuth.test.ts` - Autenticación, login, logout (4 casos)
- ✅ `usePropertyNavigation.test.ts` - Navegación de propiedades (5 casos)

### Schemas (6 tests)
- ✅ `LoginSchema.test.ts` - Validación de email y password (6 casos)

### Cobertura Notable
- `ButtonAtom.tsx`: 96.66% de cobertura
- `Badge.tsx`: 100% de cobertura
- `Label.tsx`: 78.57% de cobertura
- `format.ts`: 90.9% de cobertura
- `validation.ts`: 100% de cobertura
- `LoginSchema.ts`: 100% de cobertura
- `usePropertyNavigation.ts`: 76.47% de cobertura

---

**Nota:** Todos los mocks necesarios para módulos de Expo ya están configurados en `jest.setup.js` y `jest.polyfills.js`.
