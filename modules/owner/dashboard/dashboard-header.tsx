import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/atoms/Avatar';
import ProfileMenu from "../../../components/molecules/ProfileMenu";


interface HomeHeaderProps {
  onNavigateToReviews: () => void;
  userName: string;
  userEmail?: string;
  userPhoto?: string;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export function DashboardHeader( {
  onNavigateToReviews,
  userName,
  userEmail,
  userPhoto,
  onNavigateToProfile,
  onNavigateToSettings,
  onLogout
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-3xl font-bold text-erie-black">Bienvenido a Habitta</Text>
        <Text className="text-gray-600 mt-1">Gestiona tus propiedades eficientemente</Text>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="relative">
          <Pressable 
            className="w-10 h-10 rounded-full border border-gray-300 bg-transparent items-center justify-center"
            onPress={() => console.log('Notifications pressed')}
          >
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
          </Pressable>
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-lavender-indigo rounded-full items-center justify-center">
            <Text className="text-white text-xs font-medium">3</Text>
          </View>
        </View>
        <ProfileMenu
                  userName={userName}
                  userEmail={userEmail}
                  userPhoto={userPhoto}
                  onNavigateToProfile={onNavigateToProfile}
                  onNavigateToReviews={onNavigateToReviews}
                  onNavigateToSettings={onNavigateToSettings}
                  onLogout={onLogout}
                />
      </View>
    </View>
  );
}
