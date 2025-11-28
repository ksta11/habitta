import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import AlertModal from '../../../components/atoms/AlertModal';
import ConfirmModal from '../../../components/atoms/ConfirmModal';
import Label from '../../../components/atoms/Label';
import { useAuth } from '../../../contexts/AuthContext';
import { deleteCurrentUserProfile } from '../../../libs/userServices/api-service';

const ScreenSettings = () => {
  const { logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);

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
        setAlertData({
          type: 'success',
          title: 'Cuenta Eliminada',
          message: 'Tu cuenta ha sido eliminada exitosamente. Serás redirigido al login.'
        });
        setAlertVisible(true);
        setTimeout(() => {
          router.replace('/auth/login');
        }, 2000);
      } else {
        console.log('❌ Error eliminando cuenta:', result.message);
        setAlertData({ type: 'error', title: 'Error', message: result.message || 'No se pudo eliminar la cuenta. Intenta de nuevo.' });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setAlertData({ type: 'error', title: 'Error', message: 'Ocurrió un error inesperado. Intenta de nuevo.' });
      setAlertVisible(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    setAlertData({
      type: 'warning',
      title: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?'
    });
    setAlertVisible(true);
    // Note: In a real implementation, you might want to handle confirmation differently
    // For now, we'll proceed with logout
    setTimeout(async () => {
      console.log('🚪 Cerrando sesión...');
      await logout(); // ✅ Usa la función del contexto que limpia todo
      router.replace('/auth/login');
    }, 2000);
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
          <Link href="/(owner)/(settings)/editProfile/editProfile" asChild>
            <Pressable className="py-3 border-b border-gray-100">
              <Label text="Editar Perfil" size="md" />
            </Pressable>
          </Link>

          <Link href="/(owner)/(settings)/payment/viewPayments" asChild>
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
            onPress={() => router.push('/(owner)/(settings)/view/myDocuments')}
          >
            <Label text="Mi documentación" size="md" />
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

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
};

export default ScreenSettings;


