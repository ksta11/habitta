import { Stack } from 'expo-router';

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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Mi arrendamiento',
        }}
      />
    </Stack>
  );
}
