# 🧪 Unit Tests - Habitta

## Resumen Rápido

✅ **52 tests pasando**  
✅ **8 suites de tests**  
✅ **Cobertura en componentes, hooks, utilidades y schemas**

## 📊 Distribución de Tests

| Categoría | Tests | Archivos |
|-----------|-------|----------|
| Utilidades | 21 | `format.test.ts`, `validation.test.ts` |
| Componentes | 18 | `ButtonAtom`, `Badge`, `Label` |
| Hooks | 9 | `useAuth`, `usePropertyNavigation` |
| Schemas | 6 | `LoginSchema` |

## 🚀 Comandos Rápidos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura de código
npm run test:coverage

# Limpiar caché
npm run test:clear
```

## 📁 Estructura

```
__tests__/
├── components/          # Tests de componentes UI
│   ├── ButtonAtom.test.tsx
│   ├── Badge.test.tsx
│   └── Label.test.tsx
├── hooks/              # Tests de hooks personalizados
│   ├── useAuth.test.ts
│   └── usePropertyNavigation.test.ts
├── utils/              # Tests de funciones utilitarias
│   ├── format.test.ts
│   └── validation.test.ts
└── schemes/            # Tests de schemas de validación
    └── LoginSchema.test.ts
```

## 🎯 Cobertura Destacada

- **Badge.tsx**: 100% 🎉
- **validation.ts**: 100% 🎉
- **LoginSchema.ts**: 100% 🎉
- **ButtonAtom.tsx**: 96.66% ⭐
- **format.ts**: 90.9% ⭐
- **Label.tsx**: 78.57% ✅
- **usePropertyNavigation.ts**: 76.47% ✅

## 🔧 Configuración Técnica

### Archivos clave:
- `jest.config.js` - Configuración principal de Jest
- `jest.polyfills.js` - Polyfills para Expo SDK 54
- `jest.setup.js` - Mocks globales de módulos Expo
- `__mocks__/` - Mocks manuales de assets

### Stack de testing:
- Jest 30.2.0
- React Native Testing Library 13.3.3
- jest-expo 54.0.13
- React 19.1.0 compatible

## 📝 Ejemplos de Tests

### Componente
```typescript
it('debe renderizar con texto', () => {
  const { getByText } = render(<Badge>Test</Badge>);
  expect(getByText('Test')).toBeTruthy();
});
```

### Hook
```typescript
it('debe retornar funciones de navegación', () => {
  const { result } = renderHook(() => usePropertyNavigation());
  expect(result.current.navigateToProperty).toBeDefined();
});
```

### Utilidad
```typescript
it('debe formatear correctamente pesos colombianos', () => {
  expect(formatCurrency(1000000)).toBe('$1.000.000');
});
```

### Schema
```typescript
it('debe validar email y password correctos', () => {
  const result = loginSchema.safeParse({
    email: 'test@example.com',
    password: 'password123'
  });
  expect(result.success).toBe(true);
});
```

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module expo/..."
```bash
npm run test:clear
npm test
```

### Tests muy lentos
```bash
# Ejecutar solo un archivo
npm test -- ButtonAtom
```

### Actualizar snapshots
```bash
npm test -- -u
```

## 📚 Documentación Completa

Ver [TESTING.md](./TESTING.md) para documentación completa con guías de buenas prácticas, debugging y ejemplos avanzados.

---

**Última actualización:** Noviembre 2025  
**Tests totales:** 52  
**Estado:** ✅ Todos pasando
