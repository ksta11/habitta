import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../../components/atoms/Button';
import FileViewer from '../../components/atoms/FileViewer';
import IconButton from '../../components/atoms/IconButton';
import { usePendingIdentityDocuments } from '../../modules/admin/hooks';
import { DocumentCard } from './Organisms';




export const PendingIdentityDocumentsComponent: React.FC = () => {
  const {
    documents,
    loading,
    processing,
    rejectModalVisible,
    rejectNotes,
    documentToReject,
    viewerModalVisible,
    documentToView,
    handleApprove,
    handleReject,
    handleConfirmReject,
    handleCancelReject,
    handleViewDocument,
    handleCloseViewer,
    formatDate,
    setRejectNotes,
  } = usePendingIdentityDocuments();

  if (loading) {
    return (
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Documentos de Identidad Pendientes
        </Text>
        <View className="bg-gray-50 rounded-lg p-8 items-center">
          <FontAwesome name="spinner" size={24} color="#9CA3AF" />
          <Text className="text-gray-500 mt-4">Cargando documentos...</Text>
        </View>
      </View>
    );
  }

  if (documents.length === 0) {
    return (
      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Documentos de Identidad Pendientes
        </Text>
        <View className="bg-gray-50 rounded-lg p-8 items-center">
          <FontAwesome name="file-text-o" size={48} color="#d1d5db" />
          <Text className="text-gray-500 mt-4 text-center">
            No hay documentos de identidad pendientes
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Todos los documentos han sido procesados
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-6 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Documentos de Identidad Pendientes
        </Text>
        <Text className="text-sm text-gray-500">
          {documents.length} documento{documents.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView className="max-h-96">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            description={doc.description || undefined}
            uploadDate={doc.upload_date}
            notes={doc.notes || undefined}
            url={doc.url_document}
            processing={processing === doc.id}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleViewDocument}
            formatDate={formatDate}
          />
        ))}
      </ScrollView>

      {/* Modal para rechazar documento */}
      <Modal
        visible={rejectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelReject}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Rechazar Documento
            </Text>
            
            <Text className="text-gray-600 mb-4">
              ¿Por qué estás rechazando este documento? Proporciona una razón para el usuario.
            </Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-800"
              placeholder="Ej: Documento ilegible, información incorrecta, documento vencido..."
              value={rejectNotes}
              onChangeText={setRejectNotes}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Button
                  title="Cancelar"
                  onPress={handleCancelReject}
                  variant="outline"
                  size="sm"
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Rechazar"
                  onPress={handleConfirmReject}
                  variant="secondary"
                  size="sm"
                  disabled={!rejectNotes.trim()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para visualizar documento */}
      <Modal
        visible={viewerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseViewer}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Visualizar Documento
              </Text>
              <IconButton
                iconName="close"
                size={24}
                color="#6B7280"
                onPress={handleCloseViewer}
              />
            </View>
            
            <ScrollView className="max-h-[70vh]">
              <FileViewer fileUrl={documentToView} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
