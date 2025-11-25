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
          title: 'Mis Aquileres',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="maintenance"
        options={{
          title: 'Mantenimientos',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
