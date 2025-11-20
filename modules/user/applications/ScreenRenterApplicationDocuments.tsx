import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { z } from 'zod';
import AlertModal from '../../../components/atoms/AlertModal';
import ButtonAtom from '../../../components/atoms/ButtonAtom';
import FileUploader from '../../../components/atoms/FileUploader';
import FileViewer from '../../../components/atoms/FileViewer';
import PickerAtom from '../../../components/atoms/Picker';
import { LegalDocument } from '../../../interfaces/LegalDocumentInterface';
import { getApplicationDocuments, uploadApplicationDocument } from '../../../libs/application/documents-service';
import { getRenterApplications } from '../../../libs/userServices/application/api-service';
import {
    standarHeaderBackground,
    standarHeaderText,
    standarScreenBackground,
} from '../../../utils/TokensDesing';

// Schema para subir documentos
const UploadDocumentSchema = z.object({
  documentType: z.string().min(1, 'Selecciona un tipo de documento'),
  files: z.array(z.any()).min(1, 'Debes subir al menos un archivo'),
});

type UploadDocumentForm = z.infer<typeof UploadDocumentSchema>;

export default function RenterApplicationDocuments() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string>('');
  
  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<UploadDocumentForm>({
    resolver: zodResolver(UploadDocumentSchema),
    defaultValues: {
      documentType: 'contrato',
      files: [],
    },
  });

  const showAlert = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const loadDocuments = async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      // Obtener el estado de la aplicación
      const appsResponse = await getRenterApplications();
      if (appsResponse.success) {
        const app = appsResponse.data.find((a: any) => a.id === id);
        if (app) {
          setApplicationStatus(app.status);
        }
      }

      // Cargar documentos
      const response = await getApplicationDocuments(id);
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        showAlert('error', 'Error', response.message || 'No se pudieron cargar los documentos');
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      showAlert('error', 'Error', 'Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const onSubmit = async (data: UploadDocumentForm) => {
    if (!id) return;
    if (!data.files || data.files.length === 0) {
      showAlert('error', 'Error', 'Debes subir al menos un archivo');
      return;
    }

    const file = data.files[0];
    setUploading(true);
    try {
      const resp = await uploadApplicationDocument(file, id, data.documentType);
      if (resp.success) {
        showAlert('success', '¡Éxito!', 'Documento subido correctamente');
        reset({ documentType: 'contrato', files: [] });
        await loadDocuments();
      } else {
        showAlert('error', 'Error', resp.message || 'No se pudo subir el documento');
      }
    } catch (err) {
      console.error('Error al subir documento:', err);
      showAlert('error', 'Error', err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (files: any[]) => {
    const normalized = files.map(f => ({
      uri: f.uri,
      name: f.name || f.uri?.split('/').pop() || 'file.pdf',
      size: f.size,
      mimeType: f.mimeType || f.type || '',
    }));
    setValue('files', normalized, { shouldValidate: true });
  };

  const canUpload = applicationStatus === 'documents_required';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className={`flex-1 ${standarScreenBackground}`}>

        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6D28D9']} tintColor="#6D28D9" />
          }
        >
          {/* Formulario de subida */}
          {canUpload && (
            <View className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-4">
                <Ionicons name="cloud-upload" size={24} color="#6D28D9" />
                <Text className="text-lg font-bold text-gray-900 ml-2">
                  Subir Documento
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Tipo de documento</Text>
                <Controller
                  control={control}
                  name="documentType"
                  render={({ field: { onChange, value } }) => (
                    <PickerAtom
                      label="Tipo de documento"
                      value={value}
                      onValueChange={(val: string) => onChange(val)}
                      options={[
                        { label: 'Contrato de arrendamiento', value: 'contrato' },
                        { label: 'Comprobante de ingresos', value: 'ingresos' },
                        { label: 'Referencias personales', value: 'referencias' },
                        { label: 'Carta laboral', value: 'carta_laboral' },
                        { label: 'Extractos bancarios', value: 'extractos' },
                        { label: 'Otro documento', value: 'otro' },
                      ]}
                    />
                  )}
                />
                {errors.documentType && (
                  <Text className="text-sm text-red-500 mt-1">{errors.documentType.message}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Archivo (PDF)</Text>
                <Controller
                  control={control}
                  name="files"
                  render={({ field: { value } }) => (
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      maxFiles={1}
                      acceptedTypes={['application/pdf', 'application/*']}
                      title={value && value.length > 0 ? value[0].name : undefined}
                      disabled={uploading}
                    />
                  )}
                />
                {errors.files && <Text className="text-sm text-red-500 mt-1">{errors.files.message}</Text>}
              </View>

              <ButtonAtom
                title="Subir documento"
                onPress={handleSubmit(onSubmit)}
                loading={uploading}
                variant="habitta-primary"
                size="large"
                icon="cloud-upload-outline"
                fullWidth
              />
            </View>
          )}

          {!canUpload && applicationStatus && (
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-blue-900 mb-1">
                    Subida de documentos no disponible
                  </Text>
                  <Text className="text-xs text-blue-800 leading-5">
                    Solo puedes subir documentos cuando el estado de tu solicitud sea "Documentos Requeridos".
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Lista de documentos */}
          <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <Ionicons name="documents" size={24} color="#6D28D9" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Documentos Subidos ({documents.length})
              </Text>
            </View>

            {loading ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#6D28D9" />
                <Text className="text-gray-500 mt-4">Cargando documentos...</Text>
              </View>
            ) : documents.length === 0 ? (
              <View className="py-10 items-center">
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center">
                  No hay documentos subidos aún
                </Text>
              </View>
            ) : (
              documents.map((doc) => (
                <View key={doc.id} className="mb-4 p-4 bg-gray-50 rounded-2xl">
                  <Text className="text-base font-bold text-gray-900 mb-1">{doc.type}</Text>
                  {doc.description && (
                    <Text className="text-sm text-gray-600 mb-2">{doc.description}</Text>
                  )}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-500 ml-1">
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </Text>
                    <View className="flex-1" />
                    <View
                      className={`px-2 py-1 rounded-lg ${
                        doc.status === 'approved'
                          ? 'bg-green-100'
                          : doc.status === 'rejected'
                          ? 'bg-red-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          doc.status === 'approved'
                            ? 'text-green-700'
                            : doc.status === 'rejected'
                            ? 'text-red-700'
                            : 'text-yellow-700'
                        }`}
                      >
                        {doc.status === 'approved' ? 'Aprobado' : doc.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                      </Text>
                    </View>
                  </View>
                  {doc.notes && (
                    <View className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2">
                      <Text className="text-xs text-amber-800">{doc.notes}</Text>
                    </View>
                  )}
                  <FileViewer fileUrl={doc.url_document} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <AlertModal
          visible={alertVisible}
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
