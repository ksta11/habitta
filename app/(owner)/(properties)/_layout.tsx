import { Stack } from 'expo-router';

export default function PropertiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#531A99',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Propiedades',
        }}
      />
      <Stack.Screen 
        name="create/Form" 
        options={{ 
          headerShown: false,
          title: 'Crear Propiedad'
        }} 
      />
      <Stack.Screen 
        name="edit/[id]" 
        options={{ 
          headerShown: false,
          title: 'Editar Propiedad'
        }} 
      />
    </Stack>
  );
}
