import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Label from "../../../components/atoms/Label";
import ProfileMenu from "../../../components/molecules/ProfileMenu";
import { hapticFeedback } from "../../../utils/haptics";

interface HomeHeaderProps {
  onNavigateToReviews: () => void;
  userName: string;
  userEmail?: string;
  userPhoto?: string;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export default function HomeHeader({ 
  onNavigateToReviews,
  userName,
  userEmail,
  userPhoto,
  onNavigateToProfile,
  onNavigateToSettings,
  onLogout
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 bg-violet rounded-lg flex items-center justify-center">
          <Text className="text-white text-sm font-bold">H</Text>
        </View>
        <View>
          <Label text="Habitta" size="lg" weight="bold" />
          <Label
            text="Encuentra tu espacio ideal"
            size="sm"
            variant="default"
          />
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            console.log(
              "🚀 [HomeHeader] Botón de inbox presionado, navegando a reviews..."
            );
            console.log("🚀 [HomeHeader] Ejecutando callback de navegación...");
            // Feedback háptico al navegar a reseñas
            hapticFeedback.buttonPressLight();
            onNavigateToReviews();
            console.log("🚀 [HomeHeader] Callback ejecutado");
          }}
          className="w-10 h-10 bg-violet rounded-full flex items-center justify-center shadow-sm"
        >
          <FontAwesome name="inbox" size={16} color="white" />
        </Pressable>
        
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
