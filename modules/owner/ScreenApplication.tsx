import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Application } from '../../interfaces/application/ApplicationInterface';
import { getOwnerApplications, updateApplicationStatus } from '../../libs/application/api-service';
import ApplicationOwnerCard from './Atoms/ApplicationOwnerCard';

export default function ScreenApplication() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  // Cargar aplicaciones cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [])
  );

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getOwnerApplications();
      
      if (response.success) {
        setApplications(response.data);
        console.log('✅ Aplicaciones cargadas exitosamente');
      } else {
        console.log('❌ Error al cargar aplicaciones:', response.message);
        Alert.alert('Error', response.message || 'No se pudieron cargar las aplicaciones');
      }
    } catch (error) {
      console.error('💥 Error crítico al cargar aplicaciones:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleViewDetails = (application: Application) => {
    Alert.alert(
      'Detalles de Solicitud',
      `Solicitante: ${application.renter.name}\n\nEmail: ${application.renter.email}\n\nTeléfono: ${application.renter.phone}\n\nFecha: ${new Date(application.application_date).toLocaleDateString()}\n\nMensaje:\n"${application.description}"`,
      [
        { text: 'Cerrar', style: 'cancel' }
      ]
    );
  };

  const handleRequestDocuments = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, { 
        status: 'documents_required',
        reason: 'Documentos requeridos por el propietario'
      });

      if (response.success) {
        Alert.alert(
          'Documentos Solicitados',
          'Se ha solicitado documentación al inquilino.',
          [{ text: 'OK' }]
        );
        
        await loadApplications();
      } else {
        Alert.alert('Error', response.message || 'No se pudo solicitar los documentos');
      }
    } catch (error) {
      console.error('💥 Error al solicitar documentos:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handlePreApprove = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, { 
        status: 'pre_approved',
        reason: 'Solicitud pre-aprobada por el propietario'
      });

      if (response.success) {
        Alert.alert(
          'Solicitud Pre-aprobada',
          '¡La solicitud ha sido pre-aprobada exitosamente!',
          [{ text: 'OK' }]
        );
        
        await loadApplications();
      } else {
        Alert.alert('Error', response.message || 'No se pudo pre-aprobar la solicitud');
      }
    } catch (error) {
      console.error('💥 Error al pre-aprobar solicitud:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, { 
        status: 'approved',
        reason: 'Solicitud aprobada por el propietario'
      });

      if (response.success) {
        Alert.alert(
          'Solicitud Aprobada',
          '¡La solicitud ha sido aprobada definitivamente!',
          [{ text: 'OK' }]
        );
        
        await loadApplications();
      } else {
        Alert.alert('Error', response.message || 'No se pudo aprobar la solicitud');
      }
    } catch (error) {
      console.error('💥 Error al aprobar solicitud:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handleSign = async (applicationId: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, { 
        status: 'signed',
        reason: 'Contrato firmado'
      });

      if (response.success) {
        Alert.alert(
          'Contrato Firmado',
          '¡El contrato ha sido firmado exitosamente!',
          [{ text: 'OK' }]
        );
        
        await loadApplications();
      } else {
        Alert.alert('Error', response.message || 'No se pudo firmar el contrato');
      }
    } catch (error) {
      console.error('💥 Error al firmar contrato:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handleTerminate = async (applicationId: string, applicantName: string) => {
    Alert.alert(
      'Terminar Contrato',
      `¿Estás seguro de que quieres terminar el contrato con ${applicantName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, { 
                status: 'terminated',
                reason: 'Contrato terminado por el propietario'
              });

              if (response.success) {
                Alert.alert(
                  'Contrato Terminado',
                  'El contrato ha sido terminado.',
                  [{ text: 'OK' }]
                );
                
                await loadApplications();
              } else {
                Alert.alert('Error', response.message || 'No se pudo terminar el contrato');
              }
            } catch (error) {
              console.error('💥 Error al terminar contrato:', error);
              Alert.alert('Error', 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (applicationId: string, applicantName: string) => {
    Alert.alert(
      'Rechazar Solicitud',
      `¿Estás seguro de que quieres rechazar la solicitud de ${applicantName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, { 
                status: 'rejected',
                reason: 'Solicitud rechazada por el propietario'
              });

              if (response.success) {
                Alert.alert(
                  'Solicitud Rechazada',
                  'La solicitud ha sido rechazada.',
                  [{ text: 'OK' }]
                );
                
                // Recargar aplicaciones para obtener el estado actualizado
                await loadApplications();
              } else {
                Alert.alert('Error', response.message || 'No se pudo rechazar la solicitud');
              }
            } catch (error) {
              console.error('💥 Error al rechazar solicitud:', error);
              Alert.alert('Error', 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  const handleCancel = async (applicationId: string, applicantName: string) => {
    Alert.alert(
      'Cancelar Pre-aprobación',
      `¿Estás seguro de que quieres cancelar la pre-aprobación de ${applicantName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await updateApplicationStatus(applicationId, { 
                status: 'pending',
                reason: 'Pre-aprobación cancelada por el propietario'
              });

              if (response.success) {
                Alert.alert(
                  'Pre-aprobación Cancelada',
                  'La pre-aprobación ha sido cancelada.',
                  [{ text: 'OK' }]
                );
                
                await loadApplications();
              } else {
                Alert.alert('Error', response.message || 'No se pudo cancelar la pre-aprobación');
              }
            } catch (error) {
              console.error('💥 Error al cancelar pre-aprobación:', error);
              Alert.alert('Error', 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');

  return (
    <View className="flex-1 bg-white-traffic">
      {/* Header */}
      <View className="bg-lavender-indigo p-6 pt-12">
        <Text className="text-white-traffic text-2xl font-semibold">Solicitudes</Text>
        <Text className="text-white-traffic text-sm opacity-80 mt-1">
          {pendingApplications.length} solicitudes pendientes
        </Text>
      </View>

      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#A346E6']}
            tintColor="#A346E6"
          />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center">Cargando aplicaciones...</Text>
          </View>
        ) : applications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center mb-2">
              No hay solicitudes de arrendamiento
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Las solicitudes aparecerán aquí cuando los usuarios estén interesados en tus propiedades
            </Text>
          </View>
        ) : (
          applications.map((application) => (
            <ApplicationOwnerCard
              key={application.id}
              application={application}
              onViewDetails={handleViewDetails}
              onRequestDocuments={handleRequestDocuments}
              onPreApprove={handlePreApprove}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              onSign={handleSign}
              onTerminate={handleTerminate}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}