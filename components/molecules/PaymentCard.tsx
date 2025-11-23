import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import ButtonAtom from '../../components/atoms/ButtonAtom';
import PaymentModal from '../../components/atoms/PaymentModal';
import { formatCurrency } from '../../utils/format';
import { Payment as payment} from '../../interfaces/PaymentInterface';
import { useRouter } from 'expo-router';

interface Props {
  payment: payment;
}

const statusConfig: Record<string, any> = {
  completed: {
    label: 'Completado',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'checkmark-circle-outline',
  },
  pending: {
    label: 'Pendiente',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'time-outline',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'close-circle-outline',
  },
  expired: {
    label: 'Expirado',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'alert-circle-outline',
  },
  active: {
    label: 'Activo',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'checkmark-circle-outline',
  },
  inactive: {
    label: 'Inactivo',
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'alert-circle-outline',
  },
};

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
    return dateString as any;
  }
}

function getStatusColorHex(key?: string) {
  const k = key ? key.toLowerCase() : 'pending';
  switch (k) {
    case 'completed':
      return '#16a34a'; // green-600
    case 'pending':
      return '#d97706'; // amber-600
    case 'cancelled':
      return '#dc2626'; // red-600
    case 'expired':
      return '#6b7280'; // gray-500
    case 'active':
      return '#2563eb'; // blue-600
    case 'inactive':
      return '#9ca3af'; // gray-400
    default:
      return '#6b7280';
  }
}

export default function PaymentCard({ payment }: Props) {
  const { concept, amount, currency, created_at, status, counterparty_name, my_role } = payment;
  const router = useRouter();

  const onPay = () => {
    router.push(`./make/${payment.id_pay}`);
  };

  const onView = () => {
    // Open receipt modal
    setShowReceipt(true);
  };
  
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <View className="bg-white rounded-lg p-4 shadow mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="font-semibold text-lg text-foreground">{concept}</Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Ionicons
              name={my_role === 'payer' ? 'arrow-up-outline' : 'arrow-down-outline'}
              size={14}
              color={my_role === 'payer' ? '#dc2626' : '#16a34a'}
            />
            <Text className="text-sm text-gray-600">
              {my_role === 'payer' ? 'Pago a' : 'Recibe de'}{' '}
              <Text className="font-medium text-foreground">{counterparty_name || '—'}</Text>
            </Text>
          </View>
          {payment.description ? <Text className="text-sm text-gray-500 mt-2">{payment.description}</Text> : null}
        </View>
        {/* Amount and status */}
        <View className="items-end">
          <Text className="text-right text-xl font-bold text-foreground">{formatCurrency(amount, currency)}</Text>
          <View className="flex-row items-center justify-end mt-1">
            {/** status badge **/}
            {(() => {
              const key = status ? status.toLowerCase() : 'pending';
              const cfg = statusConfig[key] || statusConfig.pending;
              return (
                <View className={`flex-row items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.border}`}>
                  <Ionicons name={cfg.icon as any} size={14} color={getStatusColorHex(key)} />
                  <Text className="text-xs" style={{ color: getStatusColorHex(key) }}>{cfg.label}</Text>
                </View>
              );
            })()}
          </View>
            {created_at && <Text className="text-xs text-gray-400 mt-1">{formatDate(created_at)}</Text>}
            {/* If pending and due_date exists, show payment due date below the status */}
            {status && status.toLowerCase().includes('pending') && payment.due_date && (
              <View className="mt-1">
                <Text className="text-xs text-red-600">Fecha límite de pago:</Text>
                <Text className="text-xs text-red-600 font-medium">{formatDate(payment.due_date)}</Text>
              </View>
            )}
        </View>
      </View>

      <View className="flex-row mt-4 gap-2">
        {/* Actions for PAYER */}
        {my_role === 'payer' && (
          <>
            {/* pending: Ver recibo + Realizar pago */}
            {status === 'pending' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Realizar pago" onPress={onPay} variant="primary" fullWidth icon="card-outline" />
                </View>
              </>
            )}

            {/* completed: Ver recibo */}
            {status === 'completed' && (
              <View className="flex-1">
                <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
              </View>
            )}

            {/* failed: Ver recibo + Reintentar Pago */}
            {status === 'failed' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Reintentar Pago" onPress={() => Alert.alert('Reintentar', 'Simulando reintento de pago')} variant="primary" fullWidth icon="refresh-outline" />
                </View>
              </>
            )}

            {/* refunded: Ver recibo */}
            {status === 'refunded' && (
              <View className="flex-1">
                <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
              </View>
            )}

            {/* overdue: Ver recibo + Realizar Pago (urgent style) */}
            {status === 'overdue' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Realizar pago" onPress={onPay} variant="danger" fullWidth icon="warning-outline" />
                </View>
              </>
            )}
          </>
        )}

        {/* Actions for RECEIVER */}
        {my_role === 'receiver' && (
          <>
            {/* pending: Ver recibo, Enviar Recordatorio, Marcar como pagado */}
            {status === 'pending' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Enviar Recordatorio" onPress={() => Alert.alert('Recordatorio', 'Recordatorio enviado')} variant="outline" fullWidth icon="notifications-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Marcar como pagado" onPress={() => Alert.alert('Marcar', 'Marcado como pagado')} variant="success" fullWidth icon="checkmark-done-outline" />
                </View>
              </>
            )}

            {/* completed: Ver recibo */}
            {status === 'completed' && (
              <View className="flex-1">
                <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
              </View>
            )}

            {/* failed: Ver recibo + Enviar Recordatorio + Marcar como pagado */}
            {status === 'failed' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Enviar Recordatorio" onPress={() => Alert.alert('Recordatorio', 'Recordatorio enviado')} variant="outline" fullWidth icon="notifications-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Marcar como pagado" onPress={() => Alert.alert('Marcar', 'Marcado como pagado')} variant="success" fullWidth icon="checkmark-done-outline" />
                </View>
              </>
            )}

            {/* overdue: Ver recibo + Enviar aviso de mora + Marcar como pagado */}
            {status === 'overdue' && (
              <>
                <View className="flex-1">
                  <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Enviar aviso de mora" onPress={() => Alert.alert('Aviso', 'Aviso de mora enviado')} variant="danger" fullWidth icon="alert-circle-outline" />
                </View>
                <View className="w-2" />
                <View className="flex-1">
                  <ButtonAtom title="Marcar como pagado" onPress={() => Alert.alert('Marcar', 'Marcado como pagado')} variant="success" fullWidth icon="checkmark-done-outline" />
                </View>
              </>
            )}

            {/* refunded: Ver recibo */}
            {status === 'refunded' && (
              <View className="flex-1">
                <ButtonAtom title="Ver recibo" onPress={onView} variant="habitta-outline" fullWidth icon="receipt-outline" />
              </View>
            )}
          </>
        )}
      </View>

      {showReceipt && (
        <PaymentModal visible={showReceipt} onClose={() => setShowReceipt(false)} payment={payment} />
      )}
    </View>
  );
}
