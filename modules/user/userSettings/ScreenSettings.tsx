import React from 'react';
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthGuard } from '../../../middleware/AuthGuard';
import Label from '../../../components/atoms/Label';

const ScreenSettings = () => {
  const { logout } = useAuth();

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
          onPress: () => {
            console.log('🚪 Cerrando sesión...');
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleNavigation = (screen: string) => {
    // Aquí puedes agregar la lógica de navegación específica
    console.log(`Navegando a: ${screen}`);
    // router.push(screen); // Descomenta cuando tengas las pantallas creadas
  };

  return (
    <AuthGuard requiredRole="user">
      <ScrollView 
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
    >
      {/* Sección Accounts */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Accounts" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('profile-edit')}
          >
            <Label text="Editar Perfil" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('change-password')}
          >
            <Label text="Cambiar Contraseña" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('privacy-settings')}
          >
            <Label text="Configuración de Privacidad" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            onPress={() => handleNavigation('account-security')}
          >
            <Label text="Seguridad de Cuenta" size="md" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección Support & About */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Support & About" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('help-center')}
          >
            <Label text="Centro de Ayuda" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('contact-support')}
          >
            <Label text="Contactar Soporte" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            onPress={() => handleNavigation('about-app')}
          >
            <Label text="Acerca de la App" size="md" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección Cache & Cellular */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Cache & Cellular" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('clear-cache')}
          >
            <Label text="Limpiar Caché" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('data-usage')}
          >
            <Label text="Uso de Datos" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            onPress={() => handleNavigation('offline-mode')}
          >
            <Label text="Modo Sin Conexión" size="md" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección Actions */}
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Label 
          text="Actions" 
          size="lg" 
          weight="semibold"
        />
        
        <View className="mt-4 space-y-3">
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('export-data')}
          >
            <Label text="Exportar Datos" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            onPress={() => handleNavigation('delete-account')}
          >
            <Label text="Eliminar Cuenta" size="md" variant="error" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3" 
            onPress={handleLogout}
          >
            <Label text="Cerrar Sesión" size="md" variant="error" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </AuthGuard>
  );
};

export default ScreenSettings;
