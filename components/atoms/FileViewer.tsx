import { File, Paths } from 'expo-file-system';
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
} from "react-native";
import AlertModal from './AlertModal';
import ButtonAtom from "./ButtonAtom";

interface FileViewerProps {
  fileUrl: string | null;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{title: string, message: string, type: 'error'} | null>(null);
  if (!fileUrl || !fileUrl.startsWith("http")) {
    return <Text>No hay archivo disponible o la URL no es válida</Text>;
  }

  const extension = fileUrl.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "heic", "webp"].includes(extension);
  const isPdf = extension === "pdf";
  const isOffice = ["doc", "docx", "xls", "xlsx"].includes(extension);

  const openInBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      console.error("Error al abrir en navegador:", error);
      setAlertData({ title: 'Error', message: 'No se pudo abrir el archivo en el navegador.', type: 'error' });
      setAlertVisible(true);
    }
  };

  const openInExternalApp = async () => {
    try {
      const fileName = `temp_${Date.now()}.${extension}`;
      const file = new File(Paths.document, fileName);

      const downloadedFile = await File.downloadFileAsync(fileUrl, file);
      await Sharing.shareAsync(downloadedFile.uri);
    } catch (error) {
      console.error("Error al compartir archivo:", error);
      setAlertData({ title: 'Error', message: 'No se pudo compartir el archivo.', type: 'error' });
      setAlertVisible(true);
    }
  };

  const [loading, setLoading] = React.useState(true);

  return (
    <View>
      <View className="items-center my-5">
        {isImage ? (
          <>
            <Image
              source={{ uri: fileUrl }}
              className="w-[90%] h-[300px] rounded-[10px] mb-2.5 bg-gray-200"
              resizeMode="contain"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {loading && <ActivityIndicator />}
          </>
        ) : (
          <>
            <Text className="mb-2.5 text-sm text-gray-600">
              Archivo: {fileUrl.split("/").pop()}
            </Text>

            {isPdf ? (
              <ButtonAtom 
                title="Ver PDF" 
                onPress={openInBrowser}
                variant="habitta-primary"
                size="medium"
                icon="document-text-outline"
                iconPosition="left"
              />
            ) : isOffice ? (
              <ButtonAtom 
                title="Abrir con otra app" 
                onPress={openInExternalApp}
                variant="habitta-primary"
                size="medium"
                icon="share-outline"
                iconPosition="left"
              />
            ) : (
              <ButtonAtom 
                title="Abrir archivo" 
                onPress={openInBrowser}
                variant="habitta-primary"
                size="medium"
                icon="open-outline"
                iconPosition="left"
              />
            )}
          </>
        )}
      </View>

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
};

export default FileViewer;
