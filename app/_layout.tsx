import { Tabs } from "expo-router"

export default function appLayout() {
  return (
        <Tabs>
          <Tabs.Screen name="index" options={{ title: "Home" }} />

        </Tabs>
  )
}



