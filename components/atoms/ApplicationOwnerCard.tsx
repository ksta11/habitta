import React from 'react';
import { View, Text, Image } from 'react-native';
import ButtonAtom from './ButtonAtom';
import Label from './Label';
import { Application } from '../../interfaces/application/ApplicationInterface';

interface ApplicationOwnerCardProps {
  application: Application;
  onViewDetails?: (application: Application) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string, applicantName: string) => void;
  onCancel?: (applicationId: string, applicantName: string) => void;
}

export default function ApplicationOwnerCard({
  application,
  onViewDetails,
  onApprove,
  onReject,
  onCancel,
}: ApplicationOwnerCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pre_approved':
        return 'text-blue-600';
      case 'withdraw':
        return 'text-gray-600';
      default:
        return 'text-lavender-indigo';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'pre_approved':
        return 'Pre-aprobada';
      case 'withdraw':
        return 'Retirada';
      default:
        return 'Pendiente';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      case 'pre_approved':
        return 'bg-blue-50';
      case 'withdraw':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  const renderActionButtons = () => {
    switch (application.status) {
      case 'pending':
        return (
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <ButtonAtom
                title="Ver Detalles"
                onPress={() => onViewDetails?.(application)}
                variant="habitta-secondary"
                size="medium"
                icon="eye-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
            
            <View className="flex-1">
              <ButtonAtom
                title="Rechazar"
                onPress={() => onReject?.(application.id, application.renter.name)}
                variant="danger"
                size="medium"
                icon="close-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'pre_approved':
        return (
          <View className="flex-row">
            <View className="flex-1">
              <ButtonAtom
                title="Cancelar Pre-aprobación"
                onPress={() => onCancel?.(application.id, application.renter.name)}
                variant="habitta-outline"
                size="medium"
                icon="close-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'approved':
      case 'rejected':
      case 'withdraw':
        return (
          <View className={`${getStatusBackgroundColor(application.status)} rounded-2xl p-3`}>
            <Text className="text-center text-gray-600 text-sm">
              Solicitud {getStatusText(application.status).toLowerCase()}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100">
      {/* Imagen y Info Principal */}
      <View className="flex-row mb-4">
        <Image 
          source={{ uri: application.property.images[0]?.url_image || 'https://via.placeholder.com/80' }}
          className="w-20 h-20 rounded-2xl"
          resizeMode="cover"
        />
        
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-erie-black">
            {application.property.title}
          </Text>
          <Text className="text-xl font-bold text-lavender-indigo mt-1">
            ${application.property.price.toLocaleString()}/mes
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-sm text-gray-600">Estado: </Text>
            <Text className={`text-sm font-medium ${getStatusColor(application.status)}`}>
              {getStatusText(application.status)}
            </Text>
          </View>
        </View>
      </View>

      {/* Info del Solicitante */}
      <View className="mb-4">
        <Label text="Información del Solicitante" size="md" weight="semibold" />
        <View className="mt-2">
          <Text className="text-base font-medium text-erie-black">
            {application.renter.name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {application.renter.email}
          </Text>
          <Text className="text-sm text-gray-600">
            Fecha de solicitud: {new Date(application.application_date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      {renderActionButtons()}
    </View>
  );
}