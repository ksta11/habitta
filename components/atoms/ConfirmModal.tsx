import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { hapticFeedback } from '../../utils/haptics';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  /** If provided, user must type this exact value (case-sensitive) to enable confirm button */
  requireConfirmInput?: string | null;
}

export default function ConfirmModal({
  visible,
  title = 'Confirm',
  message = '',
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Done',
  requireConfirmInput = 'Confirm',
}: ConfirmModalProps) {
  const [input, setInput] = useState('');

  const needsInput = useMemo(() => !!requireConfirmInput, [requireConfirmInput]);
  const confirmEnabled = useMemo(() => {
    if (!needsInput) return true;
    return input === requireConfirmInput;
  }, [needsInput, input, requireConfirmInput]);

  const handleCancel = () => {
    hapticFeedback.buttonPressLight();
    onCancel();
  };

  const handleConfirm = () => {
    if (confirmEnabled) {
      hapticFeedback.buttonPress();
      onConfirm();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4" accessibilityLabel={title}>
        <View className="w-full max-w-[420px] bg-white rounded-xl p-5 shadow-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>

            <Pressable onPress={handleCancel} accessibilityLabel="Close" className="p-1.5 rounded-full">
              <Text className="text-[22px] text-gray-500" accessibilityRole="button">
                ×
              </Text>
            </Pressable>
          </View>

          {message ? <Text className="mt-3 text-gray-700 leading-5">{message}</Text> : null}

          {needsInput ? (
            <View className="mt-3">
              <Text className="text-[13px] text-gray-700 mb-1.5">
                Escribe "{requireConfirmInput}" para completar esta acción.
              </Text>
              <TextInput
                value={input}
                onChangeText={setInput}
                className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm text-gray-900"
                placeholder="Confirm"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Confirm input"
              />
            </View>
          ) : null}

          <View className="mt-4.5 flex-row justify-end gap-2">
            <TouchableOpacity onPress={handleCancel} className="px-3.5 py-2.5 rounded-lg min-w-[80px] items-center bg-gray-100">
              <Text className="text-gray-700 font-semibold">{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              className={`px-3.5 py-2.5 rounded-lg min-w-[80px] items-center ml-2 ${
                confirmEnabled ? 'bg-blue-600' : 'bg-blue-300'
              }`}
              disabled={!confirmEnabled}
            >
              <Text className={`font-semibold ${confirmEnabled ? 'text-white' : 'text-blue-50'}`}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}