import React from 'react';
import { type StatCardType } from './Atoms';
import { StatsGrid } from './Molecules';

interface AdminStatsGridProps {
  variant?: 'home' | 'users' | 'full' | 'custom';
  customStats?: StatCardType[];
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
  
  const getStatsForVariant = (variant: string): StatCardType[] => {
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

  return <StatsGrid stats={stats} />;
};