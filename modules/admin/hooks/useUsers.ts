import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { getAllUsers } from '../../../libs/admin/api-service';

// Tipos para los usuarios
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  verificationCode: string | null;
  creation_date: Date;
  properties?: number;
  totalPaid?: number;
  solicitudPropietario?: {
    id: string;
    estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'documentacion_incompleta';
    fecha_solicitud: string;
  };
}

/**
 * Hook para manejar la lógica de usuarios en el administrador
 * @returns Estado y funciones para manejar usuarios
 */
export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Estados para la gestión de datos de la API
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene usuarios de la API
   */
  const fetchUsers = useCallback(async () => {
    try {
      console.log('🔄 [useUsers] Obteniendo usuarios desde la API...');
      setLoading(true);
      setError(null);
      
      const response = await getAllUsers();
      
      if (response.success && response.data) {
        console.log('✅ [useUsers] Usuarios obtenidos exitosamente:', response.data.length);
        
        // Mapear los datos del backend a la estructura esperada por la UI
        const mappedUsers: User[] = response.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status || 'Activo',
          verificationCode: user.verificationCode || null,
          creation_date: user.creation_date,
          // Valores por defecto para campos que no vienen del backend
          properties: 0, // Se puede calcular desde otra API si es necesario
          totalPaid: 0,  // Se puede calcular desde otra API si es necesario
        }));
        
        setUsers(mappedUsers);
      } else {
        console.error('❌ [useUsers] Error al obtener usuarios:', response.message);
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('❌ [useUsers] Error en fetchUsers:', err);
      setError('Error de conexión al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Estadísticas calculadas
   */
  const userStats = useMemo(() => {
    const total = users.length;
    const owners = users.filter(p => p.status === 'Propietarios').length;
    const activeUsers = users.filter(p => p.status === 'Usuarios Activos').length;
    const tenants = users.filter(p => p.status === 'Inquilinos').length;
  
    return [
      {
        title: 'Total Usuarios',
        value: total.toLocaleString(),
        icon: 'users',
        color: '#3b82f6',
        bgColor: '#dbeafe'
      },
      {
        title: 'Usuarios Activos',
        value: activeUsers.toLocaleString(),
        icon: 'check-circle',
        color: '#10b981',
        bgColor: '#d1fae5'
      },
      {
        title: 'Propietarios',
        value: owners.toLocaleString(),
        icon: 'home',
        color: '#f59e0b',
        bgColor: '#fef3c7'
      },
      {
        title: 'Inquilinos',
        value: tenants.toLocaleString(),
        icon: 'user',
        color: '#8b5cf6',
        bgColor: '#ede9fe'
      }
    ];
  }, [users]);

  /**
   * Filtrado de usuarios
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || user.role === filterType;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, searchTerm, filterType, filterStatus]);

  /**
   * Maneja acciones de usuario
   */
  const handleUserAction = useCallback((action: string, user: User) => {
    Alert.alert(
      action,
      `¿Deseas ${action.toLowerCase()} a ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => console.log(`${action} user:`, user.id) }
      ]
    );
  }, []);

  /**
   * Limpia los filtros
   */
  const clearFilters = useCallback(() => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchTerm('');
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Estado
    searchTerm,
    filterType,
    filterStatus,
    users,
    loading,
    error,
    userStats,
    filteredUsers,
    
    // Funciones
    setSearchTerm,
    setFilterType,
    setFilterStatus,
    fetchUsers,
    handleUserAction,
    clearFilters,
  };
};
