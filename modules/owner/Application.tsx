import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import ApplicationOwnerCard from './Atoms/ApplicationOwnerCard';
import { useOwnerApplications } from './hooks';

export default function ScreenApplication() {
  // === HOOK DE APLICACIONES DEL PROPIETARIO ===
  const {
    applications,
    loading,
    refreshing,
    pendingApplications,
    handleRefresh,
    handleViewDetails,
    handleRequestDocuments,
    handlePreApprove,
    handleApprove,
    handleSign,
    handleTerminate,
    handleReject,
    handleCancel,
    handleUploadDocuments,
  } = useOwnerApplications();

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
              onUploadDocuments={handleUploadDocuments}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}