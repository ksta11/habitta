import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TextInput, View } from 'react-native';
import { usePendingIdentityDocuments } from '../../modules/admin/hooks';
import Button from '../atoms/Button';
import FileViewer from '../atoms/FileViewer';
import IconButton from '../atoms/IconButton';




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
          <View key={doc.id} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
            {/* Header del documento */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-base">
                  {doc.description || 'Documento de Identidad'}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Subido: {formatDate(doc.upload_date)}
                </Text>
              </View>
              <View className="bg-yellow-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-yellow-800">
                  Pendiente
                </Text>
              </View>
            </View>

            {/* Información adicional */}
            {doc.notes && (
              <View className="mb-3">
                <Text className="text-sm text-gray-600">
                  <Text className="font-medium">Notas:</Text> {doc.notes}
                </Text>
              </View>
            )}

            {/* Botones de acción */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row space-x-2">
                <Button
                  title="Aprobar"
                  onPress={() => handleApprove(doc.id)}
                  disabled={processing === doc.id}
                  variant="primary"
                  size="sm"
                />
                <Button
                  title="Rechazar"
                  onPress={() => handleReject(doc.id)}
                  disabled={processing === doc.id}
                  variant="secondary"
                  size="sm"
                />
              </View>
              
              <IconButton
                iconName="eye"
                size={20}
                color="#6B7280"
                onPress={() => handleViewDocument(doc.url_document)}
              />
            </View>

            {processing === doc.id && (
              <View className="mt-2 flex-row items-center">
                <FontAwesome name="spinner" size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-2">Procesando...</Text>
              </View>
            )}
          </View>
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
