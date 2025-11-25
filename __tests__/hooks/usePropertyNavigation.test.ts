// __tests__/hooks/usePropertyNavigation.test.ts
import { renderHook } from '@testing-library/react-native';
import { usePropertyNavigation } from '../../modules/user/hooks/usePropertyNavigation';

// Mock de expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useSegments: () => ['(user)', '(home)'],
}));

describe('usePropertyNavigation', () => {
  it('debe retornar funciones de navegación', () => {
    const { result } = renderHook(() => usePropertyNavigation());
    
    expect(result.current.navigateToProperty).toBeDefined();
    expect(result.current.navigateToPropertyDetails).toBeDefined();
    expect(result.current.navigateBack).toBeDefined();
    expect(result.current.navigateToSearch).toBeDefined();
  });

  it('debe detectar contexto de usuario', () => {
    const { result } = renderHook(() => usePropertyNavigation());
    
    expect(result.current.getCurrentContext()).toBe('user');
  });

  it('debe permitir navegar a una propiedad', () => {
    const { result } = renderHook(() => usePropertyNavigation());
    
    // No debería lanzar error
    expect(() => result.current.navigateToProperty('123')).not.toThrow();
  });

  it('debe permitir navegar hacia atrás', () => {
    const { result } = renderHook(() => usePropertyNavigation());
    
    expect(() => result.current.navigateBack()).not.toThrow();
  });

  it('debe permitir navegar a búsqueda', () => {
    const { result } = renderHook(() => usePropertyNavigation());
    
    expect(() => result.current.navigateToSearch()).not.toThrow();
  });
});
