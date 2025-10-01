import {useState, useEffect, useMemo} from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminStatsGrid } from './';
import { getAllUsers } from '../../libs/admin/api-service';

// Tipos para los usuarios - actualizado para coincidir con la respuesta del backend
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  verificationCode: string | null;
  creation_date: Date;
  // Campos adicionales para la UI (se pueden calcular o agregar desde el backend)
  properties?: number;
  totalPaid?: number;
  solicitudPropietario?: {
    id: string;
    estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'documentacion_incompleta';
    fecha_solicitud: string;
  };
}


// Componente Badge para React Native
const Badge: React.FC<{ 
  text: string; 
  variant: 'success' | 'warning' | 'danger' | 'outline' | 'primary';
}> = ({ text, variant }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 border-green-300';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300';
      case 'danger':
        return 'bg-red-100 border-red-300';
      case 'primary':
        return 'bg-blue-100 border-blue-300';
      case 'outline':
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'danger':
        return 'text-red-800';
      case 'primary':
        return 'text-blue-800';
      case 'outline':
      default:
        return 'text-gray-800';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full border ${getVariantStyle()}`}>
      <Text className={`text-xs font-medium ${getTextStyle()}`}>{text}</Text>
    </View>
  );
};

// Componente Badge para solicitudes de propietario
const SolicitudBadge: React.FC<{ 
  solicitud: User['solicitudPropietario'] 
}> = ({ solicitud }) => {
  if (!solicitud) return null;

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return { text: 'Sol. Pendiente', color: '#f59e0b', bgColor: '#fef3c7', icon: 'clock-o' };
      case 'en_revision':
        return { text: 'Sol. En Revisión', color: '#3b82f6', bgColor: '#dbeafe', icon: 'eye' };
      case 'aprobada':
        return { text: 'Sol. Aprobada', color: '#10b981', bgColor: '#d1fae5', icon: 'check-circle' };
      case 'rechazada':
        return { text: 'Sol. Rechazada', color: '#ef4444', bgColor: '#fee2e2', icon: 'times-circle' };
      case 'documentacion_incompleta':
        return { text: 'Doc. Incompleta', color: '#f97316', bgColor: '#fed7aa', icon: 'file-text' };
      default:
        return { text: 'Solicitud', color: '#6b7280', bgColor: '#f3f4f6', icon: 'file' };
    }
  };

  const config = getEstadoConfig(solicitud.estado);

  return (
    <View 
      className="flex-row items-center px-2 py-1 rounded-full mb-1"
      style={{ backgroundColor: config.bgColor }}
    >
      <FontAwesome name={config.icon as any} size={10} style={{ color: config.color }} />
      <Text className="text-xs font-medium ml-1" style={{ color: config.color }}>
        {config.text}
      </Text>
    </View>
  );
};

// Componente principal de la tabla de usuarios
export const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Estados para la gestión de datos de la API
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener usuarios de la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Obteniendo usuarios desde la API...');
      const response = await getAllUsers();
      
      if (response.success && response.data) {
        console.log('✅ Usuarios obtenidos exitosamente:', response.data.length);
        
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
        console.error('❌ Error al obtener usuarios:', response.message);
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('❌ Error en fetchUsers:', err);
      setError('Error de conexión al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

    // Estadísticas calculadas
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

  // Filtrado de usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.role === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activo':
        return <Badge text="Activo" variant="success" />;
      case 'Pendiente':
        return <Badge text="Pendiente" variant="warning" />;
      case 'Inactivo':
        return <Badge text="Inactivo" variant="danger" />;
      default:
        return <Badge text={status} variant="outline" />;
    }
  };

  const getTypeBadge = (role: string) => {
    return role === 'owner' ? (
      <Badge text="Propietario" variant="primary" />
    ) : (
      <Badge text="Inquilino" variant="outline" />
    );
  };

  const handleUserAction = (action: string, user: User) => {
    Alert.alert(
      action,
      `¿Deseas ${action.toLowerCase()} a ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => console.log(`${action} user:`, user.id) }
      ]
    );
  };

  const renderUserCard = ({ item: user }: { item: User }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      {/* Header del usuario */}
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-3">
          <Text className="text-red-600 font-bold text-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{user.name}</Text>
          <Text className="text-sm text-gray-500">ID: {user.id}</Text>
        </View>
        <View className="items-end space-y-1">
          {getTypeBadge(user.role)}
          {getStatusBadge(user.status)}
          <SolicitudBadge solicitud={user.solicitudPropietario} />
        </View>
      </View>

      {/* Información de contacto */}
      <View className="space-y-2 mb-3">
        <View className="flex-row items-center">
          <FontAwesome name="envelope" size={14} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">{user.email}</Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome name="phone" size={14} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">{user.phone}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View className="flex-row justify-between items-center mb-3 bg-gray-50 p-3 rounded-lg">
        <View className="items-center">
          <Text className="text-xs text-gray-500">Propiedades</Text>
          <Text className="text-lg font-bold text-gray-800">{user.properties}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500">Total Pagado</Text>
          <Text className="text-lg font-bold text-gray-800">€{(user.totalPaid || 0).toLocaleString()}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500">Registro</Text>
          <Text className="text-sm font-medium text-gray-800">
            {new Date(user.creation_date).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      {/* Acciones */}
      <View className="flex-row justify-end">
        {user.solicitudPropietario && (
          <Pressable
            onPress={() => Alert.alert(
              'Solicitud de Propietario',
              `${user.name} tiene una solicitud ${user.solicitudPropietario?.estado}. Ve a la sección de Solicitudes para más detalles.`,
              [{ text: 'Entendido' }]
            )}
            className="bg-purple-100 px-3 py-2 rounded-lg flex-row items-center mr-2"
          >
            <FontAwesome name="file-text" size={12} color="#8b5cf6" />
            <Text className="text-purple-600 text-xs font-medium ml-1">Ver Solicitud</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => handleUserAction('Contactar', user)}
          className="bg-blue-100 px-3 py-2 rounded-lg flex-row items-center"
        >
          <FontAwesome name="envelope" size={12} color="#3b82f6" />
          <Text className="text-blue-600 text-xs font-medium ml-1">Email</Text>
        </Pressable>
        <Pressable
          onPress={() => handleUserAction('Llamar', user)}
          className="bg-green-100 px-3 py-2 rounded-lg flex-row items-center"
        >
          <FontAwesome name="phone" size={12} color="#10b981" />
          <Text className="text-green-600 text-xs font-medium ml-1">Llamar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Gestión de Usuarios
          </Text>
          <Text className="text-gray-600">
            Administra todos los usuarios de la plataforma
          </Text>
        </View>

        {/* Stats Cards */}
        <AdminStatsGrid variant="custom" customStats={userStats} />

        {/* Filtros */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Filtros</Text>
          
          {/* Búsqueda */}
          <View className="mb-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <FontAwesome name="search" size={16} color="#6b7280" />
              <TextInput
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-3 text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Filtros por tipo y estado */}
          <View className="flex-row justify-between">
            <Pressable 
              onPress={() => setFilterType(filterType === 'all' ? 'owner' : filterType === 'owner' ? 'user' : 'all')}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                filterType === 'owner' ? 'bg-blue-100 border-blue-300' : 
                filterType === 'user' ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                filterType === 'owner' ? 'text-blue-800' : 
                filterType === 'user' ? 'text-purple-800' : 'text-gray-700'
              }`}>
                {filterType === 'all' ? 'Tipo: Todos' : 
                 filterType === 'owner' ? 'Propietarios' : 'Inquilinos'}
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={() => setFilterStatus(filterStatus === 'all' ? 'Activo' : filterStatus === 'Activo' ? 'Pendiente' : filterStatus === 'Pendiente' ? 'Inactivo' : 'all')}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                filterStatus === 'Activo' ? 'bg-green-100 border-green-300' : 
                filterStatus === 'Pendiente' ? 'bg-yellow-100 border-yellow-300' :
                filterStatus === 'Inactivo' ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                filterStatus === 'Activo' ? 'text-green-800' : 
                filterStatus === 'Pendiente' ? 'text-yellow-800' :
                filterStatus === 'Inactivo' ? 'text-red-800' : 'text-gray-700'
              }`}>
                {filterStatus === 'all' ? 'Estado: Todos' : filterStatus}
              </Text>
            </Pressable>
          </View>

          {/* Botón para limpiar filtros */}
          {(filterType !== 'all' || filterStatus !== 'all' || searchTerm !== '') && (
            <Pressable 
              onPress={() => {
                setFilterType('all');
                setFilterStatus('all');
                setSearchTerm('');
              }}
              className="mt-3 bg-red-100 px-4 py-2 rounded-lg border border-red-300 items-center"
            >
              <Text className="text-red-800 text-sm font-medium">
                Limpiar Filtros
              </Text>
            </Pressable>
          )}
        </View>

        {/* Lista de usuarios */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Usuarios ({loading ? '...' : filteredUsers.length})
          </Text>
          
          {loading ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-500 mt-4">
                Cargando usuarios...
              </Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <FontAwesome name="exclamation-triangle" size={48} color="#ef4444" />
              <Text className="text-red-600 mt-4 text-center font-medium">
                {error}
              </Text>
              <Pressable
                onPress={fetchUsers}
                className="bg-red-100 px-4 py-2 rounded-lg mt-4"
              >
                <Text className="text-red-800 font-medium">Reintentar</Text>
              </Pressable>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View className="bg-white rounded-lg p-8 items-center shadow-sm">
              <FontAwesome name="users" size={48} color="#d1d5db" />
              <Text className="text-gray-500 mt-4">
                No se encontraron usuarios con los filtros aplicados
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
