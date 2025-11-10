import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Button from '../../../components/atoms/Button';
import IconButton from '../../../components/atoms/IconButton';

interface DocumentCardProps {
  id: string;
  description?: string;
  uploadDate: string;
  notes?: string;
  url: string;
  processing?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (url: string) => void;
  formatDate: (date: string) => string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  description,
  uploadDate,
  notes,
  url,
  processing,
  onApprove,
  onReject,
  onView,
  formatDate,
}) => {
  return (
    <View className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
      {/* Header del documento */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-base">
            {description || 'Documento de Identidad'}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Subido: {formatDate(uploadDate)}
          </Text>
        </View>
        <View className="bg-yellow-100 px-2 py-1 rounded-full">
          <Text className="text-xs font-medium text-yellow-800">
            Pendiente
          </Text>
        </View>
      </View>

      {/* Información adicional */}
      {notes && (
        <View className="mb-3">
          <Text className="text-sm text-gray-600">
            <Text className="font-medium">Notas:</Text> {notes}
          </Text>
        </View>
      )}

      {/* Botones de acción */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row space-x-2">
          <Button
            title="Aprobar"
            onPress={() => onApprove(id)}
            disabled={processing === true}
            variant="primary"
            size="sm"
          />
          <Button
            title="Rechazar"
            onPress={() => onReject(id)}
            disabled={processing === true}
            variant="secondary"
            size="sm"
          />
        </View>
        
        <IconButton
          iconName="eye"
          size={20}
          color="#6B7280"
          onPress={() => onView(url)}
        />
      </View>

      {processing === true && (
        <View className="mt-2 flex-row items-center">
          <FontAwesome name="spinner" size={12} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-2">Procesando...</Text>
        </View>
      )}
    </View>
  );
};

