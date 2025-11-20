import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import ButtonAtom from '../../../components/atoms/ButtonAtom';
import Label from '../../../components/atoms/Label';
import PhoneCallButton from '../../../components/atoms/PhoneCallButton';
import WhatsAppButton from '../../../components/atoms/WhatsAppButton';
import LeaseSigningModal from '../../../components/molecules/LeaseSigningModal';
import { Application } from '../../../interfaces/application/ApplicationInterface';
import { standarDangerButton, standarPrimaryButton, standarPrimaryOutlineButton } from '../../../utils/TokensDesing';

interface ApplicationOwnerCardProps {
  application: Application;
  onViewDetails?: (application: Application) => void;
  onRequestDocuments?: (applicationId: string) => void;
  onPreApprove?: (applicationId: string) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string, applicantName: string) => void;
  onCancel?: (applicationId: string, applicantName: string) => void;
  onSign?: (applicationId: string) => void;
  onTerminate?: (applicationId: string, applicantName: string) => void;
}

export default function ApplicationOwnerCard({
  application,
  onViewDetails,
  onRequestDocuments,
  onPreApprove,
  onApprove,
  onReject,
  onCancel,
  onSign,
  onTerminate,
}: ApplicationOwnerCardProps) {
  const [showSigningModal, setShowSigningModal] = useState(false);
  
  const handleSignClick = () => {
    setShowSigningModal(true);
  };

  const handleConfirmSign = () => {
    setShowSigningModal(false);
    onSign?.(application.id);
  };
  
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
            <View className="flex-1 mr-2">
              <ButtonAtom
                title="Solicitar Docs"
                onPress={() => onRequestDocuments?.(application.id)}
                variant="habitta-primary"
                size="small"
                icon="document-text-outline"
                iconPosition="left"
                fullWidth={true}
                className={standarPrimaryButton}
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
                className={standarDangerButton}
              />
            </View>
          </View>
        );

      case 'documents_required':
        return (
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <ButtonAtom
                title="Pre-aprobar"
                onPress={() => onPreApprove?.(application.id)}
                variant="habitta-primary"
                size="medium"
                icon="checkmark-outline"
                iconPosition="left"
                fullWidth={true}
                className={standarPrimaryButton}
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
                className={standarDangerButton}
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
                className={standarPrimaryOutlineButton}
              />
            </View>
          </View>
        );

      case 'approved':
        return (
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <ButtonAtom
                title="Firmar"
                onPress={handleSignClick}
                variant="habitta-primary"
                size="medium"
                icon="create-outline"
                iconPosition="left"
                fullWidth={true}
                className={standarPrimaryButton}
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
                className={standarDangerButton}
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
                onPress={() => onTerminate?.(application.id, application.renter.name)}
                variant="danger"
                size="medium"
                icon="close-circle-outline"
                iconPosition="left"
                fullWidth={true}
                  className={standarDangerButton}
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
          {typeof application.renter.ratingAverage === 'number' && (
            <Text className="text-sm text-gray-600">Calificación: {Math.round(application.renter.ratingAverage)}%</Text>
          )}
          <Text className="text-sm text-gray-600 mt-1">
            {application.renter.email}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {application.renter.phone}
          </Text>
          <View className="flex-row gap-2 mt-2">
            <WhatsAppButton
              phoneNumber={application.renter.phone}
              message={`Hola ${application.renter.name}, te contacto sobre tu solicitud para la propiedad "${application.property.title}".`}
              variant="small"
              showLabel={false}
            />
            <PhoneCallButton
              phoneNumber={application.renter.phone}
              variant="small"
              showLabel={false}
            />
          </View>
          <Text className="text-sm text-gray-600">
            Fecha de solicitud: {new Date(application.application_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      {/* Mi Mensaje */}
      <View className="mb-4">
        <Label text="Mensaje" size="md" weight="semibold" />
        <View className="bg-gray-50 rounded-2xl p-3 mt-2">
          <Text className="text-sm text-gray-700">
            "{application.description}"
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      {renderActionButtons()}

      {/* Modal de Firma */}
      <LeaseSigningModal
        visible={showSigningModal}
        application={application}
        onClose={() => setShowSigningModal(false)}
        onConfirm={handleConfirmSign}
        title="Confirmar Firma del Contrato"
        confirmText="Firmar"
      />
    </View>
  );
}