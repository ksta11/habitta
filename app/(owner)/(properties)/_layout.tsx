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
        name="create" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
