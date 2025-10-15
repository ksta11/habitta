import { Stack } from 'expo-router';

export default function OwnerReviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Reviews Pendientes',
        }}
      />
      <Stack.Screen
        name="[reviewId]"
        options={{
          title: 'Dejar reseña',
        }}
      />
    </Stack>
  );
}