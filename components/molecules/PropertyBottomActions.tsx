import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Button from '../atoms/Button';
import { hapticFeedback } from '../../utils/haptics';

// Iconos simulados con emojis
const PhoneIcon = () => <Text>📞</Text>;
const MessageIcon = () => <Text>💬</Text>;

interface PropertyBottomActionsProps {
  onContactHost: () => void;
}

export default function PropertyBottomActions({
  onContactHost
}: PropertyBottomActionsProps) {
  const handleContactHost = () => {
    hapticFeedback.buttonPress();
    onContactHost();
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
      <View className="flex-row gap-3">
        <Pressable className="border border-gray-300 rounded-full p-3">
          <PhoneIcon />
        </Pressable>
        <Pressable className="border border-gray-300 rounded-full p-3">
          <MessageIcon />
        </Pressable>
        <View className="flex-1">
          <Button 
            title="Contactar anfitrión"
            onPress={handleContactHost}
            variant="violet"
          />
        </View>
      </View>
    </View>
  );
}