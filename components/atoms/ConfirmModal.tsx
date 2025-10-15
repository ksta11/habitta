import React, { useMemo, useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
  <View style={styles.backdrop} accessibilityLabel={title}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <Pressable onPress={onCancel} accessibilityLabel="Close" style={styles.closeButton}>
              <Text style={styles.closeText} accessibilityRole="button">
                ×
              </Text>
            </Pressable>
          </View>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          {needsInput ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Escribe "{requireConfirmInput}" para completar esta acción.
              </Text>
              <TextInput
                value={input}
                onChangeText={setInput}
                style={styles.input}
                placeholder="Confirm"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Confirm input"
              />
            </View>
          ) : null}

          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                !confirmEnabled && styles.confirmButtonDisabled,
              ]}
              disabled={!confirmEnabled}
            >
              <Text style={[styles.confirmText, !confirmEnabled && styles.confirmTextDisabled]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      android: { elevation: 8 },
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
  },
  closeText: {
    fontSize: 22,
    color: '#6b7280',
  },
  message: {
    marginTop: 12,
    color: '#374151',
    lineHeight: 20,
  },
  inputGroup: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  footer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelText: {
    color: '#374151',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmTextDisabled: {
    color: '#e6f0ff',
  },
});