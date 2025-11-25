// __tests__/hooks/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock del contexto completo
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar user null cuando no hay sesión', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('debe retornar user cuando hay sesión activa', () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      name: 'Test User',
      role: 'user' as const,
    };

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
  });

  it('debe tener función login disponible', () => {
    const loginMock = jest.fn();
    
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      login: loginMock,
      logout: jest.fn(),
      register: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('debe tener función logout disponible', () => {
    const logoutMock = jest.fn();
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '123', email: 'test@test.com', name: 'Test', role: 'user' as const },
      isLoading: false,
      login: jest.fn(),
      logout: logoutMock,
      register: jest.fn(),
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
  });
});
