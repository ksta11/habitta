import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SolicitudPropietario } from '../../../interfaces/SolicitudInterface';
import { StatusBadge } from '../Atoms';
import { DocumentList } from '../Molecules';

interface SolicitudCardProps {
  solicitud: SolicitudPropietario;
  onView?: (solicitud: SolicitudPropietario) => void;
  formatFecha: (fecha: string) => string;
}

export const SolicitudCard: React.FC<SolicitudCardProps> = ({
  solicitud,
  onView,
  formatFecha,
}) => {
  return (
    <Pressable
      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
      onPress={() => onView?.(solicitud)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-4">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {solicitud.user_name}
          </Text>
          <Text className="text-gray-600 text-sm mb-2">
            {solicitud.user_email}
          </Text>
          <View className="flex-row items-center mb-2">
            <FontAwesome name="calendar" size={12} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">
              Solicitado: {formatFecha(solicitud.fecha_solicitud)}
            </Text>
          </View>
        </View>
        <StatusBadge status={solicitud.estado} variant="solicitud" />
      </View>

      <DocumentList 
        documentos={solicitud.documentos.map(doc => ({
          id: doc.id,
          tipo: doc.tipo,
          verificado: doc.verificado,
        }))}
      />

      <View className="mt-3 pt-3 border-t border-gray-200">
        <Text className="text-sm text-gray-600">
          <Text className="font-medium">Propiedades a publicar:</Text> {solicitud.informacion_adicional.propiedades_a_publicar}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          <Text className="font-medium">Experiencia previa:</Text> {solicitud.informacion_adicional.experiencia_previa ? 'Sí' : 'No'}
        </Text>
      </View>

      {onView && (
        <View className="flex-row justify-end mt-3">
          <Pressable className="bg-blue-100 px-3 py-1 rounded">
            <Text className="text-blue-800 text-sm font-medium">Ver Detalles</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

