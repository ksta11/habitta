import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useUsers, type User } from '../../modules/admin/hooks';
import { AdminStatsGrid } from './';
import { FilterPanel, UserCard } from './Organisms';

// Componente principal de la tabla de usuarios
export const UsersTable: React.FC = () => {
  const {
    searchTerm,
    filterType,
    filterStatus,
    users,
    loading,
    error,
    userStats,
    filteredUsers,
    setSearchTerm,
    setFilterType,
    setFilterStatus,
    fetchUsers,
    handleUserAction,
    clearFilters,
  } = useUsers();

  const renderUserCard = ({ item: user }: { item: User }) => (
    <UserCard
      user={user}
      onContact={(u) => handleUserAction('Contactar', u)}
      onCall={(u) => handleUserAction('Llamar', u)}
      onViewSolicitud={(u) => {
        // Navigate to solicitudes or show alert
        console.log('View solicitud for user:', u.id);
      }}
    />
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
        <FilterPanel
          title="Filtros"
          searchPlaceholder="Buscar por nombre o email..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              label: filterType === 'all' ? 'Tipo: Todos' : 
                     filterType === 'owner' ? 'Propietarios' : 'Inquilinos',
              value: filterType,
              active: filterType !== 'all',
              onPress: () => setFilterType(filterType === 'all' ? 'owner' : filterType === 'owner' ? 'user' : 'all'),
            },
            {
              label: filterStatus === 'all' ? 'Estado: Todos' : filterStatus,
              value: filterStatus,
              active: filterStatus !== 'all',
              onPress: () => setFilterStatus(filterStatus === 'all' ? 'Activo' : filterStatus === 'Activo' ? 'Pendiente' : filterStatus === 'Pendiente' ? 'Inactivo' : 'all'),
            },
          ]}
          onClearFilters={clearFilters}
          showClearButton={filterType !== 'all' || filterStatus !== 'all' || searchTerm !== ''}
        />

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
