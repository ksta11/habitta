import { Stack } from 'expo-router';
import HeaderBackButton from '../../../components/atoms/HeaderBackButton';

export default function ApplicationsLayout() {
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
          title: 'Solicitudes de Arriendo',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="documents/[id]"
        options={{
          title: 'Documentos de la Solicitud',
        }}
      />
    </Stack>
  );
}
