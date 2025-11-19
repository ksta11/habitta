import { Stack } from 'expo-router';

export default function LeasesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="maintenance"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
