import { Stack } from 'expo-router';
import HeaderBackButton from '../../../components/atoms/HeaderBackButton';
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
          headerLeft: () => <HeaderBackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerLeft: () => <HeaderBackButton />,
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