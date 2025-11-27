import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AlertModal from '../../../components/atoms/AlertModal';
import { User } from '../hooks';

interface UserCardProps {
  user: User;
  onContact?: (user: User) => void;
  onCall?: (user: User) => void;
  onViewSolicitud?: (user: User) => void;
}

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

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onContact,
  onCall,
  onViewSolicitud,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);
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

  return (
    <View>
      <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
        {/* Header del usuario */}
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-3">
            <Text className="text-red-600 font-bold text-lg">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
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
            <Text className="text-lg font-bold text-gray-800">{user.properties || 0}</Text>
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
          {user.solicitudPropietario && onViewSolicitud && (
            <Pressable
              onPress={() => {
                setAlertData({
                  type: 'info',
                  title: 'Solicitud de Propietario',
                  message: `${user.name} tiene una solicitud ${user.solicitudPropietario?.estado}. Ve a la sección de Solicitudes para más detalles.`
                });
                setAlertVisible(true);
              }}
              className="bg-purple-100 px-3 py-2 rounded-lg flex-row items-center mr-2"
            >
              <FontAwesome name="file-text" size={12} color="#8b5cf6" />
              <Text className="text-purple-600 text-xs font-medium ml-1">Ver Solicitud</Text>
            </Pressable>
          )}
          {onContact && (
            <Pressable
              onPress={() => onContact(user)}
              className="bg-blue-100 px-3 py-2 rounded-lg flex-row items-center mr-2"
            >
              <FontAwesome name="envelope" size={12} color="#3b82f6" />
              <Text className="text-blue-600 text-xs font-medium ml-1">Email</Text>
            </Pressable>
          )}
          {onCall && (
            <Pressable
              onPress={() => onCall(user)}
              className="bg-green-100 px-3 py-2 rounded-lg flex-row items-center"
            >
              <FontAwesome name="phone" size={12} color="#10b981" />
              <Text className="text-green-600 text-xs font-medium ml-1">Llamar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

