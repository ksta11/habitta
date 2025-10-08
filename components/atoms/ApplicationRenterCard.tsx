import React from 'react';
import { Image, Text, View } from 'react-native';
import { RenterApplication } from '../../interfaces/application/RenterApplicationInterface';
import ButtonAtom from './ButtonAtom';
import Label from './Label';

interface ApplicationRenterCardProps {
  application: RenterApplication;
  onAccept?: (applicationId: string) => void;
  onWithdraw?: (applicationId: string, propertyTitle: string) => void;
  onUploadDocuments?: (applicationId: string) => void;
  onTerminate?: (applicationId: string, propertyTitle: string) => void;
}

export default function ApplicationRenterCard({
  application,
  onAccept,
  onWithdraw,
  onUploadDocuments,
  onTerminate,
}: ApplicationRenterCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pre_approved':
        return 'text-blue-600';
      case 'documents_required':
        return 'text-orange-600';
      case 'signed':
        return 'text-emerald-600';
      case 'terminated':
        return 'text-gray-800';
      case 'withdrawn':
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
      case 'documents_required':
        return 'Documentos Requeridos';
      case 'signed':
        return 'Firmada';
      case 'terminated':
        return 'Terminada';
      case 'withdrawn':
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
      case 'documents_required':
        return 'bg-orange-50';
      case 'signed':
        return 'bg-emerald-50';
      case 'terminated':
        return 'bg-gray-100';
      case 'withdrawn':
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
            <View className="flex-1">
              <ButtonAtom
                title="Cancelar Solicitud"
                onPress={() => onWithdraw?.(application.id, application.property.title)}
                variant="danger"
                size="medium"
                icon="close-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'documents_required':
        return (
          <View className="flex-row">
            <View className="flex-1 mr-3">
              <ButtonAtom
                title="Subir Documentos"
                onPress={() => onUploadDocuments?.(application.id)}
                variant="habitta-primary"
                size="medium"
                icon="cloud-upload-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
            
            <View className="flex-1">
              <ButtonAtom
                title="Retirar"
                onPress={() => onWithdraw?.(application.id, application.property.title)}
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
            <View className="flex-1 mr-3">
              <ButtonAtom
                title="Aceptar"
                onPress={() => onAccept?.(application.id)}
                variant="habitta-primary"
                size="medium"
                icon="checkmark-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
            
            <View className="flex-1">
              <ButtonAtom
                title="Rechazar"
                onPress={() => onWithdraw?.(application.id, application.property.title)}
                variant="danger"
                size="medium"
                icon="close-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'approved':
        return (
          <View className="flex-row">
            <View className="flex-1">
              <ButtonAtom
                title="Retirar Solicitud"
                onPress={() => onWithdraw?.(application.id, application.property.title)}
                variant="danger"
                size="medium"
                icon="close-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'signed':
        return (
          <View className="flex-row">
            <View className="flex-1">
              <ButtonAtom
                title="Terminar Contrato"
                onPress={() => onTerminate?.(application.id, application.property.title)}
                variant="danger"
                size="medium"
                icon="close-circle-outline"
                iconPosition="left"
                fullWidth={true}
              />
            </View>
          </View>
        );

      case 'rejected':
      case 'withdrawn':
      case 'terminated':
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
          <Text className="text-sm text-gray-600 mt-1">
            {application.property.address}
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

      {/* Info del Propietario */}
      <View className="mb-4">
        <Label text="Información del Propietario" size="md" weight="semibold" />
        <View className="mt-2">
          <Text className="text-sm text-gray-600">
            Nombre: {application.property.owner.name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Telefono: {application.property.owner.phone}
          </Text>
          <Text className="text-sm text-gray-600">
            Fecha de solicitud: {new Date(application.application_date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Mi Mensaje */}
      <View className="mb-4">
        <Label text="Mi Mensaje" size="md" weight="semibold" />
        <View className="bg-gray-50 rounded-2xl p-3 mt-2">
          <Text className="text-sm text-gray-700">
            "{application.description}"
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      {renderActionButtons()}
    </View>
  );
}