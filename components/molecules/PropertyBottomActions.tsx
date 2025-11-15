import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { hapticFeedback } from '../../utils/haptics';
import { standarContactButton, standarContactButtonPressed, standarIconButtonGhost } from '../../utils/TokensDesing';

// Iconos simulados con emojis
const PhoneIcon = () => <Text>📞</Text>;
const MessageIcon = () => <Text>💬</Text>;

interface PropertyBottomActionsProps {
  onContactHost: () => void;
}

export default function PropertyBottomActions({
  onContactHost
}: PropertyBottomActionsProps) {
  const [isPhonePressed, setIsPhonePressed] = useState(false);
  const [isMessagePressed, setIsMessagePressed] = useState(false);
  const [isContactPressed, setIsContactPressed] = useState(false);

  const handleContactHost = () => {
    hapticFeedback.buttonPress();
    onContactHost();
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
      <View className="flex-row gap-3">
        <Pressable 
          onPressIn={() => setIsPhonePressed(true)}
          onPressOut={() => setIsPhonePressed(false)}
          className={`rounded-full p-3 ${standarIconButtonGhost}`}
        >
          <PhoneIcon />
        </Pressable>
        <Pressable 
          onPressIn={() => setIsMessagePressed(true)}
          onPressOut={() => setIsMessagePressed(false)}
          className={`rounded-full p-3 ${standarIconButtonGhost}`}
        >
          <MessageIcon />
        </Pressable>
        <View className="flex-1">
          <Pressable
            onPress={handleContactHost}
            onPressIn={() => setIsContactPressed(true)}
            onPressOut={() => setIsContactPressed(false)}
            className={`${isContactPressed ? standarContactButtonPressed : standarContactButton}`}
          >
            <Text className="text-white text-center font-semibold">Contactar anfitrión</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}