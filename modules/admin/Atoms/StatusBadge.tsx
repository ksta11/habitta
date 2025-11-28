import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StatusBadgeProps {
  status: string;
  variant?: 'property' | 'solicitud' | 'user';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'property' }) => {
  const getStatusConfig = () => {
    if (variant === 'solicitud') {
      switch (status) {
        case 'pendiente':
          return { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: 'clock-o' };
        case 'en_revision':
          return { text: 'En Revisión', className: 'bg-blue-100 text-blue-800', icon: 'eye' };
        case 'aprobada':
          return { text: 'Aprobada', className: 'bg-green-100 text-green-800', icon: 'check-circle' };
        case 'rechazada':
          return { text: 'Rechazada', className: 'bg-red-100 text-red-800', icon: 'times-circle' };
        case 'documentacion_incompleta':
          return { text: 'Doc. Incompleta', className: 'bg-orange-100 text-orange-800', icon: 'file-text' };
        default:
          return { text: status, className: 'bg-gray-100 text-gray-800', icon: 'question' };
      }
    } else if (variant === 'user') {
      switch (status) {
        case 'Activo':
          return { text: 'Activo', className: 'bg-green-100 text-green-800', icon: 'check-circle' };
        case 'Pendiente':
          return { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: 'clock-o' };
        case 'Inactivo':
          return { text: 'Inactivo', className: 'bg-red-100 text-red-800', icon: 'times-circle' };
        default:
          return { text: status, className: 'bg-gray-100 text-gray-800', icon: 'question' };
      }
    } else {
      // property variant
      switch (status) {
        case 'available':
          return { text: 'Disponible', className: 'bg-green-100 text-green-800', icon: 'check-circle' };
        case 'occupied':
          return { text: 'Ocupada', className: 'bg-blue-100 text-blue-800', icon: 'home' };
        case 'maintenance':
          return { text: 'Mantenimiento', className: 'bg-yellow-100 text-yellow-800', icon: 'wrench' };
        case 'pending':
          return { text: 'Pendiente', className: 'bg-gray-100 text-gray-800', icon: 'clock-o' };
        default:
          return { text: status, className: 'bg-gray-100 text-gray-800', icon: 'question' };
      }
    }
  };

  const config = getStatusConfig();
  const colorMap: Record<string, string> = {
    'yellow': '#d97706',
    'blue': '#2563eb',
    'green': '#059669',
    'red': '#dc2626',
    'orange': '#ea580c',
    'gray': '#6b7280'
  };
  
  const colorKey = config.className.includes('yellow') ? 'yellow' :
                   config.className.includes('blue') ? 'blue' :
                   config.className.includes('green') ? 'green' :
                   config.className.includes('red') ? 'red' :
                   config.className.includes('orange') ? 'orange' : 'gray';
  
  return (
    <View className={`flex-row items-center px-2 py-1 rounded-full ${config.className}`}>
      <FontAwesome name={config.icon as any} size={10} color={colorMap[colorKey]} />
      <Text className={`text-xs font-medium ml-1 ${config.className.split(' ')[1]}`}>
        {config.text}
      </Text>
    </View>
  );
};

