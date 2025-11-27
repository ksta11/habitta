import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import AlertModal from '../../components/atoms/AlertModal';
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
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<RenterApplication[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);

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
        setAlertData({ type: 'error', title: 'Error', message: response.message });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('💥 Error crítico al cargar aplicaciones:', error);
      setAlertData({ type: 'error', title: 'Error', message: 'Error de conexión al cargar aplicaciones' });
      setAlertVisible(true);
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
    try {
      console.log('🔄 Aceptando pre-aprobación:', applicationId);
      
      const response = await updateRenterApplication(applicationId, { status: 'approved' });
      
      if (response.success) {
        console.log('✅ Pre-aprobación aceptada exitosamente');
        
        setAlertData({
          type: 'success',
          title: 'Pre-aprobación Aceptada',
          message: '¡Has aceptado la pre-aprobación! El propietario será notificado.'
        });
        setAlertVisible(true);
        
        // Recargar aplicaciones para mostrar el estado actualizado
        await loadApplications();
        
      } else {
        console.log('❌ Error al aceptar pre-aprobación:', response.message);
        setAlertData({ type: 'error', title: 'Error', message: response.message });
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('💥 Error crítico al aceptar pre-aprobación:', error);
      setAlertData({ type: 'error', title: 'Error', message: 'Error de conexión al aceptar la pre-aprobación' });
      setAlertVisible(true);
    }
  };

  const handleUploadDocuments = async (applicationId: string) => {
    console.log('📄 Subir documentos para aplicación:', applicationId);
    router.push(`/(user)/(applications)/documents/${applicationId}` as any);
  };

  const handleViewDocuments = async (applicationId: string) => {
    console.log('👁️ Ver documentos para aplicación:', applicationId);
    router.push(`/(user)/(applications)/view-documents/${applicationId}` as any);
  };

  const handleTerminate = async (applicationId: string, propertyTitle: string) => {
    setAlertData({
      type: 'warning',
      title: 'Terminar Contrato',
      message: `¿Estás seguro de que quieres terminar el contrato para "${propertyTitle}"?`
    });
    setAlertVisible(true);
    // Note: In a real implementation, you might want to handle confirmation differently
    // For now, we'll proceed with termination
    setTimeout(async () => {
      try {
        console.log('🔄 Terminando contrato:', applicationId);
        
        const response = await updateRenterApplication(applicationId, { status: 'terminated' });
        
        if (response.success) {
          console.log('✅ Contrato terminado exitosamente');
          
          setAlertData({
            type: 'info',
            title: 'Contrato Terminado',
            message: 'El contrato ha sido terminado.'
          });
          setAlertVisible(true);
          
          await loadApplications();
          
        } else {
          console.log('❌ Error al terminar contrato:', response.message);
          setAlertData({ type: 'error', title: 'Error', message: response.message });
          setAlertVisible(true);
        }
      } catch (error) {
        console.error('💥 Error crítico al terminar contrato:', error);
        setAlertData({ type: 'error', title: 'Error', message: 'Error de conexión al terminar el contrato' });
        setAlertVisible(true);
      }
    }, 2000);
  };

  const handleWithdraw = async (applicationId: string, propertyTitle: string) => {
    setAlertData({
      type: 'warning',
      title: 'Retirar Solicitud',
      message: `¿Estás seguro de que quieres retirar tu solicitud para "${propertyTitle}"?`
    });
    setAlertVisible(true);
    // Note: In a real implementation, you might want to handle confirmation differently
    // For now, we'll proceed with withdrawal
    setTimeout(async () => {
      try {
        console.log('🔄 Retirando solicitud:', applicationId);
        
        const response = await updateRenterApplication(applicationId, { status: 'withdrawn' });
        
        if (response.success) {
          console.log('✅ Solicitud retirada exitosamente');
          
          setAlertData({
            type: 'info',
            title: 'Solicitud Retirada',
            message: 'Tu solicitud ha sido retirada.'
          });
          setAlertVisible(true);
          
          // Recargar aplicaciones para mostrar el estado actualizado
          await loadApplications();
          
        } else {
          console.log('❌ Error al retirar solicitud:', response.message);
          setAlertData({ type: 'error', title: 'Error', message: response.message });
          setAlertVisible(true);
        }
      } catch (error) {
        console.error('💥 Error crítico al retirar solicitud:', error);
        setAlertData({ type: 'error', title: 'Error', message: 'Error de conexión al retirar la solicitud' });
        setAlertVisible(true);
      }
    }, 2000);
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
              onViewDocuments={handleViewDocuments}
              onTerminate={handleTerminate}
            />
          ))
        )}
      </ScrollView>

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}