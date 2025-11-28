import React from 'react';
import { Modal, Text, View } from 'react-native';
import { formatCurrency } from '../../utils/format';
import ButtonAtom from './ButtonAtom';
import { Payment as payment} from '../../interfaces/PaymentInterface';

interface Props {
  visible: boolean;
  onClose: () => void;
  payment: payment;
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
}

const statusLabels: Record<string, string> = {
  completed: 'Completado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
  expired: 'Expirado',
  active: 'Activo',
  inactive: 'Inactivo',
  failed: 'Fallido',
  refunded: 'Devuelto',
  overdue: 'Vencido',
};

export default function PaymentModal({ visible, onClose, payment }: Props) {
  const statusKey = payment.status ? payment.status.toLowerCase() : 'pending';
  const statusLabel = statusLabels[statusKey] || payment.status || '';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-center bg-black/40 p-4">
        <View className="w-full max-w-md bg-white rounded-lg p-6">
          <Text className="text-lg font-semibold mb-3">💳 Detalle del pago</Text>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Concepto:</Text>
              <Text className="text-sm font-medium">{payment.concept}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Monto:</Text>
              <Text className="text-sm font-medium">{formatCurrency(payment.amount, payment.currency)}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Estado:</Text>
              <Text className="text-sm font-medium">{statusLabel}</Text>
            </View>

            {payment.method ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Método:</Text>
                <Text className="text-sm font-medium">{payment.method}</Text>
              </View>
            ) : null}

            {payment.payment_date ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Fecha de pago:</Text>
                <Text className="text-sm font-medium">{payment.payment_date ? formatDate(payment.payment_date) : ''}</Text>
              </View>
            ) : null}

            {payment.due_date ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Fecha límite:</Text>
                <Text className="text-sm font-medium">{formatDate(payment.due_date)}</Text>
              </View>
            ) : null}

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Ref:</Text>
              <Text className="text-sm font-medium">{payment.reference_code || ''}</Text>
            </View>

            {payment.description ? (
              <View>
                <Text className="text-sm text-gray-600 mt-2">Descripción:</Text>
                <Text className="text-sm font-medium">{payment.description}</Text>
              </View>
            ) : null}

            {payment.notes ? (
              <View>
                <Text className="text-sm text-gray-600 mt-2">Notas:</Text>
                <Text className="text-sm font-medium">{payment.notes}</Text>
              </View>
            ) : null}
          </View>

          <View className="mt-6">
            <ButtonAtom title="Cerrar" onPress={onClose} variant="outline" fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}
