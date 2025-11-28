import React from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface OptionModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

export default function OptionModal({
  visible,
  title = 'Options',
  message = '',
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Done',
}: OptionModalProps) {
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

          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.confirmText}>{confirmText}</Text>
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
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
