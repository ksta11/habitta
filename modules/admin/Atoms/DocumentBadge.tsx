import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface DocumentBadgeProps {
  tipo: string;
  verificado: boolean;
}

export const DocumentBadge: React.FC<DocumentBadgeProps> = ({ tipo, verificado }) => {
  const getTipoDocumento = (tipo: string) => {
    const tipos: Record<string, string> = {
      'dni': 'DNI/NIE',
      'pasaporte': 'Pasaporte',
      'certificado_ingresos': 'Cert. Ingresos',
      'declaracion_renta': 'Decl. Renta',
      'certificado_bancario': 'Cert. Bancario',
      'otros': 'Otros'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <View 
      className={`flex-row items-center px-2 py-1 rounded text-xs ${
        verificado ? 'bg-green-100' : 'bg-gray-100'
      }`}
    >
      <FontAwesome 
        name={verificado ? 'check' : 'file-o'} 
        size={10} 
        color={verificado ? '#059669' : '#6b7280'} 
      />
      <Text className={`text-xs ml-1 ${
        verificado ? 'text-green-800' : 'text-gray-600'
      }`}>
        {getTipoDocumento(tipo)}
      </Text>
    </View>
  );
};

