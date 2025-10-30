import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LegalDocument } from '../../../interfaces/LegalDocumentInterface';
import { getPendingIdentityDocuments, updateDocumentByAdmin } from '../../../libs/legalDocuments/api-service';

/**
 * Hook para manejar la lógica de documentos de identidad pendientes
 * @returns Estado y funciones para manejar documentos pendientes
 */
export const usePendingIdentityDocuments = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [documentToReject, setDocumentToReject] = useState<string | null>(null);
  const [viewerModalVisible, setViewerModalVisible] = useState(false);
  const [documentToView, setDocumentToView] = useState<string | null>(null);

  /**
   * Carga los documentos de identidad pendientes
   */
  const loadDocuments = useCallback(async () => {
    try {
      console.log('📄 [usePendingIdentityDocuments] Cargando documentos pendientes...');
      setLoading(true);
      
      const result = await getPendingIdentityDocuments();
      if (result.success) {
        setDocuments(result.data);
        console.log('✅ [usePendingIdentityDocuments] Documentos cargados:', result.data.length);
      } else {
        console.error('❌ [usePendingIdentityDocuments] Error al cargar documentos:', result.message);
        Alert.alert('Error', result.message || 'Error al cargar documentos');
      }
    } catch (error) {
      console.error('💥 [usePendingIdentityDocuments] Error de conexión:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Aprobar un documento de identidad
   */
  const handleApprove = useCallback(async (documentId: string) => {
    Alert.alert(
      'Aprobar Documento',
      '¿Estás seguro de que deseas aprobar este documento de identidad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aprobar', 
          style: 'default',
          onPress: async () => {
            setProcessing(documentId);
            try {
              console.log('✅ [usePendingIdentityDocuments] Aprobando documento:', documentId);
              const result = await updateDocumentByAdmin(documentId, 'approved');
              if (result.success) {
                Alert.alert('Éxito', 'Documento aprobado correctamente');
                loadDocuments();
              } else {
                Alert.alert('Error', result.message || 'Error al aprobar documento');
              }
            } catch (error) {
              console.error('💥 [usePendingIdentityDocuments] Error al aprobar:', error);
              Alert.alert('Error', 'Error al aprobar documento');
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  }, [loadDocuments]);

  /**
   * Iniciar el proceso de rechazo (abre el modal)
   */
  const handleReject = useCallback((documentId: string) => {
    console.log('❌ [usePendingIdentityDocuments] Iniciando rechazo para documento:', documentId);
    setDocumentToReject(documentId);
    setRejectNotes('');
    setRejectModalVisible(true);
  }, []);

  /**
   * Confirmar el rechazo del documento
   */
  const handleConfirmReject = useCallback(async () => {
    if (!documentToReject) return;

    console.log('❌ [usePendingIdentityDocuments] Confirmando rechazo para documento:', documentToReject);
    setProcessing(documentToReject);
    setRejectModalVisible(false);
    
    try {
      const result = await updateDocumentByAdmin(documentToReject, 'rejected', rejectNotes);
      if (result.success) {
        Alert.alert('Éxito', 'Documento rechazado correctamente');
        loadDocuments();
      } else {
        Alert.alert('Error', result.message || 'Error al rechazar documento');
      }
    } catch (error) {
      console.error('💥 [usePendingIdentityDocuments] Error al rechazar:', error);
      Alert.alert('Error', 'Error al rechazar documento');
    } finally {
      setProcessing(null);
      setDocumentToReject(null);
      setRejectNotes('');
    }
  }, [documentToReject, rejectNotes, loadDocuments]);

  /**
   * Cancelar el rechazo del documento
   */
  const handleCancelReject = useCallback(() => {
    console.log('🚫 [usePendingIdentityDocuments] Cancelando rechazo');
    setRejectModalVisible(false);
    setDocumentToReject(null);
    setRejectNotes('');
  }, []);

  /**
   * Abrir el visor de documentos
   */
  const handleViewDocument = useCallback((url: string) => {
    console.log('👁️ [usePendingIdentityDocuments] Abriendo documento:', url);
    setDocumentToView(url);
    setViewerModalVisible(true);
  }, []);

  /**
   * Cerrar el visor de documentos
   */
  const handleCloseViewer = useCallback(() => {
    console.log('🚫 [usePendingIdentityDocuments] Cerrando visor');
    setViewerModalVisible(false);
    setDocumentToView(null);
  }, []);

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Cargar documentos al montar el componente
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    // Estado
    documents,
    loading,
    processing,
    rejectModalVisible,
    rejectNotes,
    documentToReject,
    viewerModalVisible,
    documentToView,
    
    // Funciones
    loadDocuments,
    handleApprove,
    handleReject,
    handleConfirmReject,
    handleCancelReject,
    handleViewDocument,
    handleCloseViewer,
    formatDate,
    
    // Setters para el modal
    setRejectNotes,
  };
};
