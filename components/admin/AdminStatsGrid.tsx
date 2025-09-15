import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Tipos para las estadísticas
interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor?: string;
  subtitle?: string;
}

interface AdminStatsGridProps {
  variant?: 'home' | 'users' | 'full' | 'custom';
  customStats?: StatCard[];
}

// Mock data - en una app real esto vendría de tu API
const mockStats = {
  totalUsers: 1234,
  activeUsers: 987,
  owners: 156,
  tenants: 831,
  totalProperties: 567,
  activeProperties: 489,
  pendingUsers: 34,
  inactiveUsers: 213,
  totalRevenue: 125000,
  monthlyRevenue: 25000,
};

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ variant = 'full', customStats }) => {
  
  const getStatsForVariant = (variant: string): StatCard[] => {
    if (variant === 'custom' && customStats) {
      return customStats;
    }
    
    switch (variant) {
      case 'home':
        return [
          {
            title: 'Total Usuarios',
            value: mockStats.totalUsers.toLocaleString(),
            icon: 'users',
            color: '#3b82f6',
            bgColor: '#dbeafe',
            subtitle: 'Usuarios registrados'
          },
          {
            title: 'Propiedades',
            value: mockStats.totalProperties.toLocaleString(),
            icon: 'building',
            color: '#10b981',
            bgColor: '#d1fae5',
            subtitle: 'Propiedades activas'
          },
          {
            title: 'Usuarios Activos',
            value: mockStats.activeUsers.toLocaleString(),
            icon: 'check-circle',
            color: '#059669',
            bgColor: '#d1fae5',
            subtitle: 'Últimos 30 días'
          },
          {
            title: 'Ingresos Mes',
            value: `€${(mockStats.monthlyRevenue / 1000).toFixed(0)}K`,
            icon: 'euro',
            color: '#7c3aed',
            bgColor: '#ede9fe',
            subtitle: 'Ingresos mensuales'
          }
        ];
      
      case 'users':
        return [
          {
            title: 'Total Usuarios',
            value: mockStats.totalUsers.toLocaleString(),
            icon: 'users',
            color: '#3b82f6',
            bgColor: '#dbeafe'
          },
          {
            title: 'Usuarios Activos',
            value: mockStats.activeUsers.toLocaleString(),
            icon: 'check-circle',
            color: '#10b981',
            bgColor: '#d1fae5'
          },
          {
            title: 'Propietarios',
            value: mockStats.owners.toLocaleString(),
            icon: 'home',
            color: '#f59e0b',
            bgColor: '#fef3c7'
          },
          {
            title: 'Inquilinos',
            value: mockStats.tenants.toLocaleString(),
            icon: 'user',
            color: '#8b5cf6',
            bgColor: '#ede9fe'
          }
        ];
      
      case 'full':
      default:
        return [
          {
            title: 'Total Usuarios',
            value: mockStats.totalUsers.toLocaleString(),
            icon: 'users',
            color: '#3b82f6',
            bgColor: '#dbeafe',
            subtitle: 'Usuarios registrados'
          },
          {
            title: 'Usuarios Activos',
            value: mockStats.activeUsers.toLocaleString(),
            icon: 'check-circle',
            color: '#10b981',
            bgColor: '#d1fae5',
            subtitle: 'Activos ahora'
          },
          {
            title: 'Propietarios',
            value: mockStats.owners.toLocaleString(),
            icon: 'home',
            color: '#f59e0b',
            bgColor: '#fef3c7',
            subtitle: 'Dueños de propiedades'
          },
          {
            title: 'Inquilinos',
            value: mockStats.tenants.toLocaleString(),
            icon: 'user',
            color: '#8b5cf6',
            bgColor: '#ede9fe',
            subtitle: 'Arrendatarios'
          },
          {
            title: 'Total Propiedades',
            value: mockStats.totalProperties.toLocaleString(),
            icon: 'building',
            color: '#06b6d4',
            bgColor: '#cffafe',
            subtitle: 'Propiedades totales'
          },
          {
            title: 'Propiedades Activas',
            value: mockStats.activeProperties.toLocaleString(),
            icon: 'check-square',
            color: '#059669',
            bgColor: '#d1fae5',
            subtitle: 'En alquiler'
          },
          {
            title: 'Usuarios Pendientes',
            value: mockStats.pendingUsers.toLocaleString(),
            icon: 'clock',
            color: '#f59e0b',
            bgColor: '#fef3c7',
            subtitle: 'Esperando aprobación'
          },
          {
            title: 'Ingresos Totales',
            value: `€${(mockStats.totalRevenue / 1000).toFixed(0)}K`,
            icon: 'euro',
            color: '#7c3aed',
            bgColor: '#ede9fe',
            subtitle: 'Ingresos acumulados'
          }
        ];
    }
  };

  const stats = getStatsForVariant(variant);

  const renderStatCard = (stat: StatCard, index: number) => {
    // Generar bgColor automáticamente si no se proporciona
    const bgColor = stat.bgColor || `${stat.color}20`; // Agregar transparencia al color
    
    return (
      <View key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 w-[48%] mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-gray-600 text-sm font-medium mb-1">{stat.title}</Text>
            <Text className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</Text>
            {stat.subtitle && (
              <Text className="text-xs text-gray-500">{stat.subtitle}</Text>
            )}
          </View>
          <View 
            className="p-3 rounded-full ml-3"
            style={{ backgroundColor: bgColor }}
          >
            <FontAwesome 
              name={stat.icon as any} 
              size={20} 
              color={stat.color} 
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat, index) => renderStatCard(stat, index))}
      </View>
    </View>
  );
};