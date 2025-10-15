import { Paths, File } from 'expo-file-system';
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
    ActivityIndicator,
    Button,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface FileViewerProps {
  fileUrl: string | null;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl }) => {
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
      alert("No se pudo abrir el archivo en el navegador.");
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
      alert("No se pudo compartir el archivo.");
    }
  };

  const [loading, setLoading] = React.useState(true);

  return (
    <View style={styles.container}>
      {isImage ? (
        <>
          <Image
            source={{ uri: fileUrl }}
            style={styles.image}
            resizeMode="contain"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && <ActivityIndicator />}
        </>
      ) : (
        <>
          <Text style={styles.filename}>
            Archivo: {fileUrl.split("/").pop()}
          </Text>

          {isPdf ? (
            <Button title="Ver PDF" onPress={openInBrowser} />
          ) : isOffice ? (
            <Button title="Abrir con otra app" onPress={openInExternalApp} />
          ) : (
            <Button title="Abrir archivo" onPress={openInBrowser} />
          )}
        </>
      )}
    </View>
  );
};

export default FileViewer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  filename: {
    marginBottom: 10,
    fontSize: 14,
    color: "#555",
  },
});
