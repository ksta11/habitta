import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../middleware/AuthGuard';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';
import { getCurrentUserProfile } from '../../libs/userServices/api-service';

export default function ProfileScreen() {
  const { user, logout, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Función para cargar el perfil desde el backend
  const loadUserProfile = async () => {
    try {
      console.log('� Cargando perfil desde el backend...');
      const response = await getCurrentUserProfile();
      
      if (response.user && response.user.id) {
        // Los datos ya vienen en el formato correcto del backend
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          creation_date: response.user.creation_date.toString()
        };
        
        console.log('✅ Datos obtenidos del backend:', userData);
        
        // Actualizar los datos del contexto y del estado local
        await updateUserData(userData);
        setProfileData(userData);
        setLastUpdated(new Date());
        
        console.log('✅ Perfil actualizado exitosamente');
      } else {
        console.log('❌ Error al cargar perfil:', response.message);
        if (response.message && response.message.includes('Tu sesión ha expirado')) {
          Alert.alert('Sesión Expirada', response.message);
        } else {
          Alert.alert('Error', response.message || 'No se pudieron cargar los datos del perfil');
        }
      }
    } catch (error) {
      console.error('💥 Error crítico:', error);
      Alert.alert('Error', 'Error de conexión al cargar el perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
  };

  // Cargar perfil cada vez que el componente recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Pantalla de perfil enfocada, cargando datos del backend...');
      setLoading(true);
      loadUserProfile();
    }, [])
  );
  
  // Debug: Log de datos del usuario
  console.log('👤 Datos del usuario en ProfileScreen:', profileData);
  console.log('👤 Usuario name:', profileData?.name);
  console.log('👤 Usuario email:', profileData?.email);
  console.log('👤 Usuario phone:', profileData?.phone);
  
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Datos del usuario con fallbacks (usar profileData en lugar de user)
  const displayName = profileData?.name || '';
  const displayEmail = profileData?.email || '';
  const displayPhone = profileData?.phone || '';
  const displayRole = profileData?.role || 'user';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Mostrar loading si está cargando inicialmente
  if (loading && !profileData) {
    return (
      <AuthGuard requiredRole="user">
        <View className="flex-1 bg-gray-50 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
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
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => router.push('/(user)/settings/editProfile')}
          >
            <Label text="Editar Perfil" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 border-b border-gray-100">
            <Label text="Cambiar Contraseña" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3" onPress={handleLogout}>
            <Label text="Cerrar Sesión" size="md" variant="error" />
          </TouchableOpacity>
        </View>
      </View>
        </View>
      </ScrollView>
    </AuthGuard>
  );
}
