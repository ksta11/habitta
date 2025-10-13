import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { getUserLegalDocuments } from '../../../../libs/legalDocuments/api-service';
import type { LegalDocument } from '../../../../interfaces/LegalDocumentInterface';
import FileViewer from '../../../../components/atoms/FileViewer';


const DocumentCard: React.FC<{ doc: LegalDocument }> = ({ doc }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{doc.type}</Text>
      <Text style={styles.description}>{doc.description || 'Sin descripción'}</Text>
      {doc.notes ? <Text style={styles.notes}>Notas: {doc.notes}</Text> : null}
      <Text style={styles.meta}>Estado: {doc.status}</Text>
      <Text style={styles.meta}>Subido: {new Date(doc.upload_date).toLocaleString()}</Text>
      <View style={styles.viewer}>
        <FileViewer fileUrl={doc.url_document} />
      </View>
    </View>
  );
};

const MyDocumentsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await getUserLegalDocuments();
        if (!resp.success) {
          setError(resp.message || 'Error al obtener documentos');
          setDocuments(resp.data || []);
        } else {
          setDocuments(resp.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} />;
  if (error) return <View style={styles.center}><Text>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis documentos</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DocumentCard doc={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No hay documentos.</Text>}
      />
    </View>
  );
};

export default MyDocumentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, elevation: 2 },
  type: { fontWeight: '700', marginBottom: 6 },
  description: { color: '#333', marginBottom: 6 },
  notes: { color: '#666', marginBottom: 6, fontStyle: 'italic' },
  meta: { color: '#777', fontSize: 12 },
  viewer: { marginTop: 10 },
});
