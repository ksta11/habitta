import React from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { AuthGuard } from '../../../middleware/AuthGuard';
import Label from '../../../components/atoms/Label';
import { useProfile } from '../profile/hooks/useProfile';

export default function ProfileScreen() {
  // === HOOK DE PERFIL ===
  const {
    profileData,
    loading,
    refreshing,
    lastUpdated,
    displayName,
    displayEmail,
    displayPhone,
    displayRole,
    userInitial,
    handleRefresh,
    handleLogout,
    navigateToEditProfile,
  } = useProfile();

  // Mostrar loading si está cargando inicialmente
  if (loading && !profileData) {
    return (
      <AuthGuard requiredRole="user">
        <View className="flex-1 bg-gray-50 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6 " />
          <Text className="mt-4 text-gray-600">Cargando perfil...</Text>
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="user">
      <ScrollView 
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
            title="Actualizando perfil..."
          />
        }
      >
        <View className="p-6">
      {/* Header */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        {refreshing && (
          <View className="flex-row items-center justify-center mb-2">
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text className="ml-2 text-blue-600 text-sm">Actualizando datos...</Text>
          </View>
        )}
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-blue-600">{userInitial}</Text>
          </View>
          <Label 
            text={displayName} 
            size="xl" 
            weight="bold"
          />
          <Label 
            text={displayEmail} 
            size="md" 
            variant="default"
          />
          <View className="mt-2 px-3 py-1 bg-green-100 rounded-full">
            <Label 
              text={displayRole === 'admin' ? 'Administrador' : 'Usuario'} 
              size="sm" 
              weight="medium"
            />
          </View>
          
          {lastUpdated && (
            <Text className="text-xs text-gray-500 mt-3">
              Última actualización: {lastUpdated.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
              })}
            </Text>
          )}
        </View>
      </View>

      {/* Información personal */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Información Personal" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Label text="Teléfono" size="md" />
            <Label text={displayPhone} size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Label text="Fecha de registro" size="md" />
            <Label text={profileData?.creation_date ? new Date(profileData.creation_date).toLocaleDateString() : 'No disponible'} size="md" weight="medium" />
          </View>
          
          <View className="flex-row justify-between py-2">
            <Label text="ID de usuario" size="md" />
            <Label text={profileData?.id?.substring(0, 8) + '...' || 'No disponible'} size="md" weight="medium" />
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Label 
          text="Acciones" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <Pressable 
            className="py-3 border-b border-gray-100"
            onPress={navigateToEditProfile}
          >
            <Label text="Editar Perfil" size="md" />
          </Pressable>
          
          <Pressable className="py-3 border-b border-gray-100">
            <Label text="Cambiar Contraseña" size="md" />
          </Pressable>
          
          <Pressable className="py-3" onPress={handleLogout}>
            <Label text="Cerrar Sesión" size="md" variant="error" />
          </Pressable>
        </View>
      </View>
        </View>
      </ScrollView>
    </AuthGuard>
  );
}

