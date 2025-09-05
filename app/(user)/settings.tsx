import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthGuard } from '../../middleware/AuthGuard';
import Label from '../../components/atoms/Label';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

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

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    showToggle = false, 
    toggleValue, 
    onToggle, 
    showArrow = true 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-3 shadow-sm"
      onPress={onPress}
      disabled={showToggle}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Label text={title} size="md" weight="medium" />
          {subtitle && (
            <Label text={subtitle} size="sm" variant="default" />
          )}
        </View>
        
        {showToggle && onToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={toggleValue ? '#f5dd4b' : '#f4f3f4'}
          />
        ) : showArrow ? (
          <Label text=">" size="lg" variant="default" />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <AuthGuard requiredRole="user">
      <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Label 
            text="Configuración" 
            size="xl" 
            weight="bold"
          />
          <Label 
            text="Personaliza tu experiencia" 
            size="md" 
            variant="default"
          />
        </View>

        {/* Cuenta */}
        <View className="mb-6">
          <Label 
            text="Cuenta" 
            size="lg" 
            weight="semibold"
          />
          <View className="mt-3">
            <SettingItem
              title="Información Personal"
              subtitle="Actualiza tu perfil y datos"
              onPress={() => console.log('Ir a perfil')}
            />
            <SettingItem
              title="Cambiar Contraseña"
              subtitle="Actualiza tu contraseña de acceso"
              onPress={() => console.log('Cambiar contraseña')}
            />
            <SettingItem
              title="Seguridad"
              subtitle="Configuración de seguridad y privacidad"
              onPress={() => console.log('Ir a seguridad')}
            />
          </View>
        </View>

        {/* Preferencias */}
        <View className="mb-6">
          <Label 
            text="Preferencias" 
            size="lg" 
            weight="semibold"
          />
          <View className="mt-3">
            <SettingItem
              title="Notificaciones"
              subtitle="Recibir alertas y recordatorios"
              showToggle={true}
              toggleValue={notifications}
              onToggle={setNotifications}
              showArrow={false}
            />
            <SettingItem
              title="Modo Oscuro"
              subtitle="Cambiar apariencia de la aplicación"
              showToggle={true}
              toggleValue={darkMode}
              onToggle={setDarkMode}
              showArrow={false}
            />
            <SettingItem
              title="Autenticación Biométrica"
              subtitle="Usar huella o Face ID"
              showToggle={true}
              toggleValue={biometric}
              onToggle={setBiometric}
              showArrow={false}
            />
          </View>
        </View>

        {/* Soporte */}
        <View className="mb-6">
          <Label 
            text="Soporte" 
            size="lg" 
            weight="semibold"
          />
          <View className="mt-3">
            <SettingItem
              title="Centro de Ayuda"
              subtitle="Preguntas frecuentes y guías"
              onPress={() => console.log('Ir a ayuda')}
            />
            <SettingItem
              title="Contactar Soporte"
              subtitle="Enviar mensaje al equipo de soporte"
              onPress={() => console.log('Contactar soporte')}
            />
            <SettingItem
              title="Términos y Condiciones"
              subtitle="Lee nuestros términos de uso"
              onPress={() => console.log('Ver términos')}
            />
            <SettingItem
              title="Política de Privacidad"
              subtitle="Cómo manejamos tu información"
              onPress={() => console.log('Ver política')}
            />
          </View>
        </View>

        {/* Sobre la App */}
        <View className="mb-6">
          <Label 
            text="Sobre la App" 
            size="lg" 
            weight="semibold"
          />
          <View className="mt-3">
            <SettingItem
              title="Versión"
              subtitle="1.0.0"
              showArrow={false}
            />
            <SettingItem
              title="Créditos"
              subtitle="Desarrollado por el equipo Habitta"
              onPress={() => console.log('Ver créditos')}
            />
          </View>
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity 
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          onPress={handleLogout}
        >
          <View className="items-center">
            <Label 
              text="Cerrar Sesión" 
              size="md" 
              weight="semibold"
              variant="error"
            />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </AuthGuard>
  );
}
