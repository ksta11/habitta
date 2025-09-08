import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerTransparent: true, // Hace el header transparente
        headerTitle: '', // Sin título
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'settings', // Sin título para que no se vea texto
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerTransparent: false, // Asegurar que no sea transparente para el color
          headerBackVisible: false, // Ocultar el botón de back nativo
        }}
      />
      <Stack.Screen 
        name="editProfile" 
        options={{
          title: 'Edit Profile', // Sin título para que no se vea texto
          headerStyle: {
            backgroundColor: '#7C3AED',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerTransparent: false, // Asegurar que no sea transparente para el color
          headerBackVisible: false, // Ocultar el botón de back nativo
        }}
      />
    </Stack>
  );
}

// import { Stack } from "expo-router";

// export default function SettingsLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: { backgroundColor: "#7C3AED" },
//         headerTintColor: "#FFFFFF",
//         headerShadowVisible: false,
//         headerTitle: "",
//       }}
//     >
//       {/* ⚠️ Usa index, no settings */}
//       <Stack.Screen name="index" options={{ title: "Settings" }} />
//       <Stack.Screen name="editProfile" options={{ title: "Edit Profile" }} />
//     </Stack>
//   );
// }
