import React from "react"
import { Pressable, Text } from "react-native"
import { useTheme } from "@/app/ui/theme/useTheme"

export function ThemeToggle() {
  const { isDarkMode } = useTheme()
  // You would need to implement a way to actually toggle the theme here
  return (
    <Pressable onPress={() => console.log("Toggle theme")}>
      <Text>{isDarkMode ? "🌙" : "☀️"}</Text>
    </Pressable>
  )
}
