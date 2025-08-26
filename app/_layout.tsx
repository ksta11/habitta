import { Tabs } from "expo-router"
import "../global.css"

export default function appLayout() {
  return (
        <Tabs>
          <Tabs.Screen name="index" options={{ title: "Home" }} />

        </Tabs>
  )
}



