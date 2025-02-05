import { useColorScheme } from "react-native"
import { useMemo } from "react"
import { generateColorThemes, getColors } from "./colors"

export type Colors = ReturnType<typeof getColors>
export function useTheme() {
  const scheme = useColorScheme()

  return useMemo(() => {
    const currentTheme = scheme === "dark" ? "dark" : "light"
    const theme = generateColorThemes(currentTheme)
    const colors = getColors(currentTheme)
    const isDarkMode = currentTheme === "dark"

    return { theme, isDarkMode, colors }
  }, [scheme])
}
