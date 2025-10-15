import { ScrollView, Text, View } from 'react-native';
import Input from '../components/atoms/Input';
import PickerAtom from '../components/atoms/Picker';

// Ejemplo de uso de props de color para los componentes atómicos
export default function ColorExamples() {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6">🎨 Ejemplos de Colores para Componentes Atómicos</Text>
      
      {/* Input Examples */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-4">📝 Input Component</Text>
        
        {/* Default */}
        <Input
          label="Input por defecto"
          placeholder="Colores estándar"
          value=""
        />
        
        {/* Blue Theme */}
        <Input
          label="Tema azul"
          placeholder="Esquema de color azul"
          value=""
          borderColor="#3B82F6"
          backgroundColor="#EFF6FF"
          labelColor="#1E40AF"
          textColor="#1E40AF"
          placeholderColor="#93C5FD"
        />
        
        {/* Green Theme */}
        <Input
          label="Tema verde (dinero)"
          placeholder="Para campos de precio"
          value=""
          borderColor="#10B981"
          backgroundColor="#ECFDF5"
          labelColor="#047857"
          textColor="#047857"
          placeholderColor="#6EE7B7"
        />
        
        {/* Purple Theme */}
        <Input
          label="Tema morado (premium)"
          placeholder="Para campos especiales"
          value=""
          borderColor="#8B5CF6"
          backgroundColor="#F3E8FF"
          labelColor="#7C3AED"
          textColor="#7C3AED"
          placeholderColor="#C4B5FD"
        />
        
        {/* Dark Theme */}
        <Input
          label="Tema oscuro"
          placeholder="Esquema dark"
          value=""
          borderColor="#374151"
          backgroundColor="#1F2937"
          labelColor="#D1D5DB"
          textColor="#F9FAFB"
          placeholderColor="#9CA3AF"
        />
        
        {/* Error Example */}
        <Input
          label="Con error personalizado"
          placeholder="Campo con error"
          value=""
          error="Este campo tiene un error"
          errorColor="#DC2626"
        />
      </View>
      
      {/* Picker Examples */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-4">🔽 PickerAtom Component</Text>
        
        {/* Default */}
        <PickerAtom
          label="Picker por defecto"
          value="option1"
          onValueChange={() => {}}
          options={[
            { label: 'Opción 1', value: 'option1' },
            { label: 'Opción 2', value: 'option2' }
          ]}
        />
        
        {/* Blue Theme */}
        <PickerAtom
          label="Picker azul"
          value="option1"
          onValueChange={() => {}}
          options={[
            { label: 'Casa', value: 'house' },
            { label: 'Apartamento', value: 'apartment' }
          ]}
          borderColor="#3B82F6"
          backgroundColor="#EFF6FF"
          labelColor="#1E40AF"
          textColor="#1E40AF"
        />
        
        {/* Orange Theme */}
        <PickerAtom
          label="Picker naranja (estado)"
          value="active"
          onValueChange={() => {}}
          options={[
            { label: 'Activo', value: 'active' },
            { label: 'Inactivo', value: 'inactive' }
          ]}
          borderColor="#F97316"
          backgroundColor="#FFF7ED"
          labelColor="#EA580C"
          textColor="#EA580C"
        />
        
        {/* Error Example */}
        <PickerAtom
          label="Picker con error"
          value=""
          onValueChange={() => {}}
          options={[
            { label: 'Selecciona...', value: '' },
            { label: 'Opción 1', value: 'option1' }
          ]}
          error="Debes seleccionar una opción"
          errorColor="#DC2626"
        />
      </View>
      
      {/* Color Palette Reference */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-4">🎨 Paleta de Colores Sugerida</Text>
        
        <View className="bg-white rounded-lg p-4">
          <Text className="font-semibold mb-2">Colores principales:</Text>
          <Text>• Azul: #3B82F6 (bordes), #EFF6FF (fondo), #1E40AF (texto)</Text>
          <Text>• Verde: #10B981 (bordes), #ECFDF5 (fondo), #047857 (texto)</Text>
          <Text>• Morado: #8B5CF6 (bordes), #F3E8FF (fondo), #7C3AED (texto)</Text>
          <Text>• Naranja: #F97316 (bordes), #FFF7ED (fondo), #EA580C (texto)</Text>
          <Text>• Rojo: #EF4444 (errores)</Text>
          <Text>• Gris: #6B7280 (texto secundario), #D1D5DB (bordes neutros)</Text>
        </View>
      </View>
      
      {/* Usage Tips */}
      <View className="bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 font-bold mb-2">💡 Tips de uso:</Text>
        <Text className="text-blue-700 mb-1">• Usa colores consistentes por categoría (ej: verde para dinero)</Text>
        <Text className="text-blue-700 mb-1">• El fondo debe ser más claro que el borde</Text>
        <Text className="text-blue-700 mb-1">• El texto debe contrastar bien con el fondo</Text>
        <Text className="text-blue-700">• Usa el mismo color para label y texto para coherencia</Text>
      </View>
    </ScrollView>
  );
}