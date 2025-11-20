import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import ConfirmModal from '../../../components/atoms/ConfirmModal';
import Label from '../../../components/atoms/Label';
import { useAuth } from '../../../contexts/AuthContext';
import { deleteCurrentUserProfile } from '../../../libs/userServices/api-service';

const ScreenSettings = () => {
  const { logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    setConfirmVisible(true);
  };

  const [confirmVisible, setConfirmVisible] = useState(false);

  const confirmDeleteAccount = async () => {
    setConfirmVisible(false);
    try {
      setIsDeleting(true);
      console.log('🗑️ Iniciando eliminación de cuenta...');

      const result = await deleteCurrentUserProfile();

      if (result.verify) {
        console.log('✅ Cuenta eliminada exitosamente');
        Alert.alert(
          'Cuenta Eliminada',
          'Tu cuenta ha sido eliminada exitosamente. Serás redirigido al login.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/auth/login');
              },
            },
          ]
        );
      } else {
        console.log('❌ Error eliminando cuenta:', result.message);
        Alert.alert('Error', result.message || 'No se pudo eliminar la cuenta. Intenta de nuevo.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intenta de nuevo.', [{ text: 'OK' }]);
    } finally {
      setIsDeleting(false);
    }
  };

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
            console.log('🚪 Cerrando sesión...');
            await logout(); // ✅ Usa la función del contexto que limpia todo
            router.replace('/auth/login');
          },
        },
      ]
    );
  };


  return (
    <>
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
            <Pressable className="py-3 border-b border-gray-100">
              <Label text="Editar Perfil" size="md" />
            </Pressable>
          </Link>
          
          

          <Link href="/(user)/settings/payment/viewPayments" asChild>
            <Pressable className="py-3 border-b border-gray-100">
              <Label text="Gestionar Pagos" size="md" />
            </Pressable>
          </Link>
          
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Configuración de privacidad no implementada aún')}
          >
            <Label text="Configuración de Privacidad" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3"
            // onPress={() => console.log('Seguridad de cuenta no implementada aún')}
          >
            <Label text="Seguridad de Cuenta" size="md" />
          </Pressable>
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
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Centro de ayuda no implementado aún')}
          >
            <Label text="Centro de Ayuda" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Contacto de soporte no implementado aún')}
          >
            <Label text="Contactar Soporte" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3"
            // onPress={() => console.log('Acerca de la app no implementado aún')}
          >
            <Label text="Acerca de la App" size="md" />
          </Pressable>
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
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Limpiar caché no implementado aún')}
          >
            <Label text="Limpiar Caché" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Uso de datos no implementado aún')}
          >
            <Label text="Uso de Datos" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3"
            // onPress={() => console.log('Modo sin conexión no implementado aún')}
          >
            <Label text="Modo Sin Conexión" size="md" />
          </Pressable>
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
          <Pressable 
            className="py-3 border-b border-gray-100"
            // onPress={() => console.log('Exportar datos no implementado aún')}
          >
            <Label text="Exportar Datos" size="md" />
          </Pressable>
          
          <Pressable 
            className="py-3 border-b border-gray-100"
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <Label 
              text={isDeleting ? "Eliminando..." : "Eliminar Cuenta"} 
              size="md" 
              variant="error" 
            />
          </Pressable>
          
          <Pressable 
            className="py-3" 
            onPress={handleLogout}
          >
            <Label text="Cerrar Sesión" size="md" variant="error" />
          </Pressable>
        </View>
      </View>
      </ScrollView>
      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar Cuenta"
        message="¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer y se perderán todos tus datos permanentemente."
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDeleteAccount}
        requireConfirmInput="confirmar"
        cancelText="Cancelar"
        confirmText="Eliminar Cuenta"
      />
    </>
  );
};

export default ScreenSettings;

