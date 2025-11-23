import { Stack } from 'expo-router';

export default function HomeLayout() {
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
          title: 'Inicio',
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{
          title: 'Detalles',
        }}
       />
    </Stack>
  );
}