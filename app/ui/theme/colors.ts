import { vars } from "nativewind"
import colorThemes from "./useConfigThemes"
import { interpolateColor } from "react-native-reanimated"
import { Appearance, Platform } from "react-native"

// primary: Primary color.
// primary-content: Foreground content color to use on primary color.
// secondary: Secondary color.
// secondary-content: Foreground content color to use on secondary color.
// accent: Accent color.
// accent-content: Foreground content color to use on accent color.
// neutral: Neutral color.
// neutral-content: Foreground content color to use on neutral color.
// base-100: Base color of page, used for blank backgrounds.
// base-200: Base color, a little darker.
// base-300: Base color, even more darker.
// base-content: Foreground content color to use on base color.
// info: Info color.
// info-content: Foreground content color to use on info color.
// success: Success color.
// success-content: Foreground content color to use on success color.
// warning: Warning color.
// warning-content: Foreground content color to use on warning color.
// error: Error color.
// error-content: Foreground content color to use on error color.
// card: Background color of cards.
// background: Normal color of the screen

export interface ThemeData {
  "color-scheme": string
  primary: string
  "primary-content": string
  secondary: string
  "secondary-content": string
  accent: string
  "accent-content": string
  neutral: string
  "neutral-content": string
  background: string
  border: string
  dim: string
  "base-100": string
  "base-200": string
  "base-300": string
  "base-content": string
  info: string
  "info-content": string
  success: string
  "success-content": string
  warning: string
  "warning-content": string
  error: string
  "error-content": string
  card: string
  inverse: string
  "inverse-content": string
}

export function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, "")
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r} ${g} ${b}`
}

export function convertRgbStringToObject(rgb: string): string {
  const rgbaMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch
    return `${r} ${g} ${b}`
  } else {
    console.warn(`Unexpected color format: ${rgb}`)
    return `0 0 0`
  }
}

export function generateDarkenColorFrom(input: string, percentage = 0.07): string {
  try {
    const result = interpolateColor(percentage, [0, 1], [input, "black"]) as string
    return convertRgbStringToObject(result)
  } catch (e) {
    console.error(`Failed to darken color: ${input}`, e)
    return input
  }
}

export function generateThemeColorsObject(colorScheme: ThemeData) {
  const themeColors: Record<string, string> = {}

  Object.entries(colorScheme).forEach(([key, value]) => {
    themeColors[`--color-${key}`] = hexToRgb(value)
  })

  return vars(themeColors)
}

export function generateColorThemes(themeName: string) {
  const theme = colorThemes[themeName as keyof typeof colorThemes]

  if (!theme) {
    throw new Error(`Theme "${themeName}" not found.`)
  }

  return generateThemeColorsObject(theme)
}

export interface Colors {
  colorScheme: string
  border: string
  background: string
  primary: string
  primaryContent: string
  secondary: string
  secondaryContent: string
  accent: string
  accentContent: string
  neutral: string
  neutralContent: string
  base100: string
  base200: string
  base300: string
  baseContent: string
  info: string
  infoContent: string
  success: string
  successContent: string
  warning: string
  warningContent: string
  error: string
  errorContent: string
  card: string
  inverse: string
  dim: string
  inverseContent: string
  black: string
  white: string
  headerBackground: string
}

export const colors = getColors(Appearance.getColorScheme() === "dark" ? "dark" : "light")

export function getColors(themeName: string): Colors {
  const themeData = colorThemes[themeName as keyof typeof colorThemes]
  if (!themeData) {
    throw new Error(`Theme "${themeName}" not found.`)
  }

  return {
    colorScheme: themeData["color-scheme"],
    primary: themeData.primary,
    border: themeData.border,
    background: themeData.background,
    dim: themeData.dim,
    primaryContent: themeData["primary-content"],
    secondary: themeData.secondary,
    secondaryContent: themeData["secondary-content"],
    accent: themeData.accent,
    accentContent: themeData["accent-content"],
    neutral: themeData.neutral,
    neutralContent: themeData["neutral-content"],
    base100: themeData["base-100"],
    base200: themeData["base-200"],
    base300: themeData["base-300"],
    baseContent: themeData["base-content"],
    info: themeData.info,
    infoContent: themeData["info-content"],
    success: themeData.success,
    successContent: themeData["success-content"],
    warning: themeData.warning,
    warningContent: themeData["warning-content"],
    error: themeData.error,
    errorContent: themeData["error-content"],
    card: themeData.card,
    inverse: themeData.inverse,
    inverseContent: themeData["inverse-content"],
    black: "#000000",
    white: "#ffffff",
    headerBackground: themeName === "dark" ? "#121212" : "#FFFFFF",
  }
}

const IOS_SYSTEM_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(242, 242, 247)",
    grey5: "rgb(230, 230, 235)",
    grey4: "rgb(210, 210, 215)",
    grey3: "rgb(199, 199, 204)",
    grey2: "rgb(175, 176, 180)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(242, 242, 247)",
    foreground: "rgb(0, 0, 0)",
    root: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    destructive: "rgb(255, 56, 43)",
    primary: "rgb(0, 123, 254)",
  },
  dark: {
    grey6: "rgb(21, 21, 24)",
    grey5: "rgb(40, 40, 42)",
    grey4: "rgb(55, 55, 57)",
    grey3: "rgb(70, 70, 73)",
    grey2: "rgb(99, 99, 102)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(0, 0, 0)",
    foreground: "rgb(255, 255, 255)",
    root: "rgb(0, 0, 0)",
    card: "rgb(21, 21, 24)",
    destructive: "rgb(254, 67, 54)",
    primary: "rgb(3, 133, 255)",
  },
} as const

const ANDROID_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(249, 249, 255)",
    grey5: "rgb(215, 217, 228)",
    grey4: "rgb(193, 198, 215)",
    grey3: "rgb(113, 119, 134)",
    grey2: "rgb(65, 71, 84)",
    grey: "rgb(24, 28, 35)",
    background: "rgb(249, 249, 255)",
    foreground: "rgb(0, 0, 0)",
    root: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    destructive: "rgb(186, 26, 26)",
    primary: "rgb(0, 112, 233)",
  },
  dark: {
    grey6: "rgb(16, 19, 27)",
    grey5: "rgb(39, 42, 50)",
    grey4: "rgb(49, 53, 61)",
    grey3: "rgb(54, 57, 66)",
    grey2: "rgb(139, 144, 160)",
    grey: "rgb(193, 198, 215)",
    background: "rgb(0, 0, 0)",
    foreground: "rgb(255, 255, 255)",
    root: "rgb(0, 0, 0)",
    card: "rgb(16, 19, 27)",
    destructive: "rgb(147, 0, 10)",
    primary: "rgb(3, 133, 255)",
  },
} as const

export const COLORS = Platform.OS === "ios" ? IOS_SYSTEM_COLORS : ANDROID_COLORS
