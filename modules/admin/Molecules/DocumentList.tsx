import React from 'react';
import { Text, View } from 'react-native';
import { DocumentBadge } from '../Atoms';

interface Document {
  id: string;
  tipo: string;
  verificado: boolean;
}

interface DocumentListProps {
  documentos: Document[];
  title?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documentos,
  title,
}) => {
  return (
    <View className="mt-2">
      {title && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {title} ({documentos.length})
        </Text>
      )}
      <View className="flex-row flex-wrap gap-1">
        {documentos.map((doc) => (
          <DocumentBadge
            key={doc.id}
            tipo={doc.tipo}
            verificado={doc.verificado}
          />
        ))}
      </View>
    </View>
  );
};

