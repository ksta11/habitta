import { Stack } from 'expo-router';
import HeaderBackButton from '../../../components/atoms/HeaderBackButton';

export default function LeasesLayout() {
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
        headerLeft: () => <HeaderBackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Mi Alquiler',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="maintenance/index"
        options={{
          title: 'Historial de Mantenimientos',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="maintenance/request"
        options={{
          title: 'Solicitar Mantenimiento',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
