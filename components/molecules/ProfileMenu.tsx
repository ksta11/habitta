import React, { useState } from 'react';
import { View, Pressable, Text, Modal, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { hapticFeedback } from '../../utils/haptics';
import Label from '../atoms/Label';

interface ProfileMenuProps {
  userName?: string;
  userEmail?: string;
  userPhoto?: string; // URL de la foto si existe en el futuro
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToReviews?: () => void;
  onLogout?: () => void;
}

export default function ProfileMenu({
  userName = 'Usuario',
  userEmail,
  userPhoto,
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToReviews,
  onLogout
}: ProfileMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  // Obtener inicial del nombre
  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  const toggleMenu = () => {
    hapticFeedback.selection();
    setMenuVisible(!menuVisible);
  };

  const handleMenuOption = (action?: () => void) => {
    hapticFeedback.buttonPressLight();
    setMenuVisible(false);
    action?.();
  };

  const menuOptions = [
    {
      icon: 'user',
      label: 'Mi Perfil',
      action: onNavigateToProfile,
      show: !!onNavigateToProfile
    },
    {
      icon: 'inbox',
      label: 'Mis Reseñas',
      action: onNavigateToReviews,
      show: !!onNavigateToReviews
    },
    {
      icon: 'cog',
      label: 'Configuración',
      action: onNavigateToSettings,
      show: !!onNavigateToSettings
    },
    {
      icon: 'sign-out',
      label: 'Cerrar Sesión',
      action: onLogout,
      show: !!onLogout,
      danger: true
    }
  ];

  return (
    <View>
      {/* Avatar Button */}
      <Pressable
        onPress={toggleMenu}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet shadow-sm"
      >
        {userPhoto ? (
          <Image
            source={{ uri: userPhoto }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-violet items-center justify-center">
            <Text className="text-white text-lg font-bold">
              {getInitial()}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={toggleMenu}
        >
          {/* Menu Container */}
          <View className="absolute top-16 right-6 bg-white rounded-2xl shadow-lg overflow-hidden min-w-[220px]">
            {/* User Info Header */}
            <View className="px-4 py-3 bg-violet/5 border-b border-gray-100">
              <Text className="text-base font-semibold text-gray-900">{userName}</Text>
              {userEmail && (
                <Text className="text-sm text-gray-600 mt-0.5">
                  {userEmail}
                </Text>
              )}
            </View>

            {/* Menu Options */}
            <View className="py-2">
              {menuOptions.map((option, index) => 
                option.show ? (
                  <Pressable
                    key={index}
                    onPress={() => handleMenuOption(option.action)}
                    className={`flex-row items-center px-4 py-3 active:bg-gray-50 ${
                      option.danger ? 'border-t border-gray-100' : ''
                    }`}
                  >
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${
                      option.danger ? 'bg-red-50' : 'bg-violet/10'
                    }`}>
                      <FontAwesome
                        name={option.icon as any}
                        size={14}
                        color={option.danger ? '#EF4444' : '#7C3AED'}
                      />
                    </View>
                    <Text className={`ml-3 text-base ${option.danger ? 'text-red-500' : 'text-gray-900'}`}>
                      {option.label}
                    </Text>
                  </Pressable>
                ) : null
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}