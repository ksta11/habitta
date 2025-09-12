import React from 'react';
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, Link } from 'expo-router';
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
          <Link href="/(user)/settings/editProfile" asChild>
            <TouchableOpacity className="py-3 border-b border-gray-100">
              <Label text="Editar Perfil" size="md" />
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Pantalla de cambio de contraseña no implementada aún')}
          >
            <Label text="Cambiar Contraseña" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Configuración de privacidad no implementada aún')}
          >
            <Label text="Configuración de Privacidad" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            // onPress={() => console.log('Seguridad de cuenta no implementada aún')}
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
            // onPress={() => console.log('Centro de ayuda no implementado aún')}
          >
            <Label text="Centro de Ayuda" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Contacto de soporte no implementado aún')}
          >
            <Label text="Contactar Soporte" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            // onPress={() => console.log('Acerca de la app no implementado aún')}
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
            // onPress={() => console.log('Limpiar caché no implementado aún')}
          >
            <Label text="Limpiar Caché" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Uso de datos no implementado aún')}
          >
            <Label text="Uso de Datos" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3"
            // onPress={() => console.log('Modo sin conexión no implementado aún')}
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
            // onPress={() => console.log('Exportar datos no implementado aún')}
          >
            <Label text="Exportar Datos" size="md" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Eliminar cuenta no implementado aún')}
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
