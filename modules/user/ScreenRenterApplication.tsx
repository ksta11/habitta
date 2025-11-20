import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { RenterApplication } from '../../interfaces/application/RenterApplicationInterface';
import { getRenterApplications, updateRenterApplication } from '../../libs/userServices/application/api-service';
import {
  standarEmptyStateText,
  standarEmptyStateTextSecondary,
  standarHeaderBackground,
  standarHeaderText,
  standarHeaderTextSecondary,
  standarScreenBackground
} from '../../utils/TokensDesing';
import ApplicationRenterCard from './Atoms/ApplicationRenterCard';

export default function ScreenRenterApplication() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<RenterApplication[]>([]);

  // Función para cargar aplicaciones desde la API
  const loadApplications = async () => {
    try {
      console.log('🔄 Cargando aplicaciones del renter...');
      const response = await getRenterApplications();
      
      if (response.success) {
        console.log('✅ Aplicaciones cargadas exitosamente:', response.data.length);
        setApplications(response.data);
      } else {
        console.log('❌ Error al cargar aplicaciones:', response.message);
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('💥 Error crítico al cargar aplicaciones:', error);
      Alert.alert('Error', 'Error de conexión al cargar aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  // Cargar aplicaciones cuando el componente se monta
  useEffect(() => {
    loadApplications();
  }, []);

  // Auto-refresh cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Pantalla de aplicaciones renter recibió foco - refrescando datos...');
      loadApplications();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleAccept = async (applicationId: string) => {
    Alert.alert(
      'Aceptar Pre-aprobación',
      '¿Estás seguro de que quieres aceptar esta pre-aprobación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          style: 'default',
          onPress: async () => {
            try {
              console.log('🔄 Aceptando pre-aprobación:', applicationId);
              
              const response = await updateRenterApplication(applicationId, { status: 'approved' });
              
              if (response.success) {
                console.log('✅ Pre-aprobación aceptada exitosamente');
                
                Alert.alert(
                  'Pre-aprobación Aceptada',
                  '¡Has aceptado la pre-aprobación! El propietario será notificado.',
                  [{ text: 'OK' }]
                );
                
                // Recargar aplicaciones para mostrar el estado actualizado
                await loadApplications();
                
              } else {
                console.log('❌ Error al aceptar pre-aprobación:', response.message);
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              console.error('💥 Error crítico al aceptar pre-aprobación:', error);
              Alert.alert('Error', 'Error de conexión al aceptar la pre-aprobación');
            }
          }
        }
      ]
    );
  };

  const handleUploadDocuments = async (applicationId: string) => {
    // Función placeholder - sin funcionalidad como solicitaste
    console.log('📄 Subir documentos para aplicación:', applicationId);
    // Aquí iría la lógica para subir documentos en el futuro
  };

  const handleTerminate = async (applicationId: string, propertyTitle: string) => {
    Alert.alert(
      'Terminar Contrato',
      `¿Estás seguro de que quieres terminar el contrato para "${propertyTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Terminando contrato:', applicationId);
              
              const response = await updateRenterApplication(applicationId, { status: 'terminated' });
              
              if (response.success) {
                console.log('✅ Contrato terminado exitosamente');
                
                Alert.alert(
                  'Contrato Terminado',
                  'El contrato ha sido terminado.',
                  [{ text: 'OK' }]
                );
                
                await loadApplications();
                
              } else {
                console.log('❌ Error al terminar contrato:', response.message);
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              console.error('💥 Error crítico al terminar contrato:', error);
              Alert.alert('Error', 'Error de conexión al terminar el contrato');
            }
          }
        }
      ]
    );
  };

  const handleWithdraw = async (applicationId: string, propertyTitle: string) => {
    Alert.alert(
      'Retirar Solicitud',
      `¿Estás seguro de que quieres retirar tu solicitud para "${propertyTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Retirando solicitud:', applicationId);
              
              const response = await updateRenterApplication(applicationId, { status: 'withdrawn' });
              
              if (response.success) {
                console.log('✅ Solicitud retirada exitosamente');
                
                Alert.alert(
                  'Solicitud Retirada',
                  'Tu solicitud ha sido retirada.',
                  [{ text: 'OK' }]
                );
                
                // Recargar aplicaciones para mostrar el estado actualizado
                await loadApplications();
                
              } else {
                console.log('❌ Error al retirar solicitud:', response.message);
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              console.error('💥 Error crítico al retirar solicitud:', error);
              Alert.alert('Error', 'Error de conexión al retirar la solicitud');
            }
          }
        }
      ]
    );
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const documentsRequiredApplications = applications.filter(app => app.status === 'documents_required');
  const preApprovedApplications = applications.filter(app => app.status === 'pre_approved');
  const activeApplications = applications.filter(app => ['approved', 'signed'].includes(app.status));

  return (
    <View className={`flex-1 ${standarScreenBackground}`}>
      {/* Header */}
      <View className={`${standarHeaderBackground} p-6 pt-12`}>
        <Text className={`${standarHeaderText} text-2xl font-semibold`}>Mis Solicitudes</Text>
        <Text className={`${standarHeaderTextSecondary} text-sm mt-1`}>
          {pendingApplications.length} pendientes • {documentsRequiredApplications.length} docs requeridos • {preApprovedApplications.length} pre-aprobadas • {activeApplications.length} activas
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
            <Text className={`${standarEmptyStateText} mb-2`}>
              Cargando aplicaciones...
            </Text>
          </View>
        ) : applications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className={`${standarEmptyStateText} mb-2`}>
              No tienes solicitudes de arrendamiento
            </Text>
            <Text className={standarEmptyStateTextSecondary}>
              Cuando solicites una propiedad, aparecerá aquí
            </Text>
          </View>
        ) : (
          applications.map((application) => (
            <ApplicationRenterCard
              key={application.id}
              application={application}
              onAccept={handleAccept}
              onWithdraw={handleWithdraw}
              onUploadDocuments={handleUploadDocuments}
              onTerminate={handleTerminate}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}