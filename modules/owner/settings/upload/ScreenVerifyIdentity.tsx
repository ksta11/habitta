import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import AlertModal from '../../../../components/atoms/AlertModal';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import FileUploader from '../../../../components/atoms/FileUploader';
import Input from '../../../../components/atoms/Input';
import PickerAtom from '../../../../components/atoms/Picker';
import { submitIdentityVerification } from '../../../../libs/legalDocuments/api-service';
import { VerifyIdentityForm, VerifyIdentitySchema } from '../../../../schemes/VerifyIdentitySchema';

// Schema y tipos importados desde schemes/VerifyIdentitySchema

export default function VerifyIdentityPage() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<VerifyIdentityForm>({
    resolver: zodResolver(VerifyIdentitySchema),
    defaultValues: {
      documentType: 'CC',
      documentNumber: '',
      files: []
    }
  });

  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string } | null>(null);

  const onSubmit = async (data: VerifyIdentityForm) => {
    if (!data.files || data.files.length === 0) {
      setAlertData({ type: 'error', title: 'Error', message: 'Debes subir el documento en PDF' });
      setAlertVisible(true);
      return;
    }

    const file = data.files[0];
    setSubmitting(true);
    try {
      const resp = await submitIdentityVerification(file, data.documentType, data.documentNumber);
      if (resp.success) {
        setAlertData({
          type: 'success',
          title: 'Éxito',
          message: resp.message || 'Solicitud enviada correctamente'
        });
        setAlertVisible(true);
        setTimeout(() => router.replace('/(owner)/(settings)'), 2000);
      } else {
        setAlertData({ type: 'error', title: 'Error', message: resp.message || 'No se pudo enviar la solicitud' });
        setAlertVisible(true);
      }
    } catch (err) {
      console.error('Error al enviar verificación:', err);
      setAlertData({ type: 'error', title: 'Error', message: err instanceof Error ? err.message : 'Error de conexión' });
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (files: any[]) => {
    // Normalizar la respuesta del FileUploader (DocumentPicker assets)
    const normalized = files.map(f => ({
      uri: f.uri || f.uri || f.uri, // algunos assets usan "uri" o "uri"
      name: f.name || f.uri?.split('/').pop() || 'file.pdf',
      size: f.size,
      mimeType: f.mimeType || f.type || ''
    }));

    setValue('files', normalized, { shouldValidate: true });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Verificar tu identidad antes de continuar</Text>
          <Text className="text-gray-600">Sube tu documento de identidad escaneado en formato PDF</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2">Tipo de documento</Text>
          <Controller
            control={control}
            name="documentType"
            render={({ field: { onChange, value } }) => (
              <PickerAtom
                label="Tipo de documento"
                value={value}
                onValueChange={(val) => onChange(val)}
                options={[
                  { label: 'Cédula de ciudadanía (CC)', value: 'CC' },
                  { label: 'Cédula de extranjería (CE)', value: 'CE' },
                  { label: 'Pasaporte (PP)', value: 'PP' },
                  { label: 'Permiso Especial de Permanencia (PEP)', value: 'PEP' },
                  { label: 'Permiso por Protección Temporal (PPT)', value: 'PPT' },
                  { label: 'Número de Identificación Tributaria (NIT)', value: 'NIT' }
                ]}
              />
            )}
          />
          {errors.documentType && <Text className="text-sm text-red-500 mt-1">{errors.documentType.message}</Text>}
        </View>

        <View className="mb-4">
          <Text className="mb-2">Número de documento</Text>
          <Controller
            control={control}
            name="documentNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Dirección"
                placeholder="Número de documento"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.documentNumber && <Text className="text-sm text-red-500 mt-1">{errors.documentNumber.message}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-2">Documento (PDF)</Text>
          <Controller
            control={control}
            name="files"
            render={({ field: { value } }) => (
              <FileUploader
                onFileSelect={handleFileSelect}
                maxFiles={1}
                acceptedTypes={["application/pdf", "application/*"]}
                title={value && value.length > 0 ? value[0].name : undefined}
                disabled={uploadDisabled}
              />
            )}
          />
          {errors.files && <Text className="text-sm text-red-500 mt-1">{errors.files.message}</Text>}
        </View>

        <View className="mb-8">
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <ButtonAtom
                title="Enviar verificación"
                onPress={handleSubmit(onSubmit)}
                loading={submitting}
                variant="habitta-primary"
                size="large"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <ButtonAtom
                title="Cancelar"
                onPress={() => {
                  // Reset form and navigate back to settings index
                  reset({ documentType: 'CC', documentNumber: '', files: [] });
                  setUploadDisabled(false);
                  setSubmitting(false);
                  router.replace('/(owner)/(settings)');
                }}
                variant="secondary"
                size="large"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertVisible}
        type={alertData?.type}
        title={alertData?.title || ''}
        message={alertData?.message || ''}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
