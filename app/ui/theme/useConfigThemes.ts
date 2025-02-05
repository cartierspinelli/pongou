import { ThemeData } from "./colors"
import appConfig from "@/a0/config/app.config.json"

// Default themes to fall back on
const defaultThemes: Record<string, ThemeData> = {
  dark: {
    primary: "#570DF8",
    "primary-content": "#FFFFFF",
    secondary: "#ff00c3",
    "secondary-content": "#FFFFFF",
    accent: "#aef80d",
    "accent-content": "#000000",
    neutral: "#7c7194",
    "neutral-content": "#FFFFFF",
    "base-100": "#1d232a",
    "base-200": "#191e24",
    "base-300": "#15191e",
    "base-content": "#FFFFFF",
    info: "#54c7ec",
    success: "#87cf3a",
    warning: "#f7c325",
    error: "#ff6b6b",
    "info-content": "#000000",
    "success-content": "#000000",
    "warning-content": "#000000",
    "error-content": "#000000",
    card: "#15191e",
    background: "#060606",
    "color-scheme": "dark",
    border: "#2A303C",
    inverse: "#FFFFFF",
    "inverse-content": "#000000",
    dim: "#5E626B",
  },
  light: {
    primary: "#570DF8",
    "primary-content": "#FFFFFF",
    secondary: "#ff00c3",
    "secondary-content": "#FFFFFF",
    accent: "#aef80d",
    "accent-content": "#000000",
    neutral: "#7c7194",
    "neutral-content": "#FFFFFF",
    "base-100": "#FFFFFF",
    "base-200": "#F2F2F2",
    "base-300": "#E5E6E6",
    "base-content": "#1F2937",
    info: "#3ABFF8",
    success: "#36D399",
    warning: "#FBBD23",
    error: "#F87272",
    "info-content": "#FFFFFF",
    "success-content": "#FFFFFF",
    "warning-content": "#FFFFFF",
    "error-content": "#FFFFFF",
    card: "#E5E6E6",
    background: "#FFFFFF",
    "color-scheme": "light",
    border: "#E5E7EB",
    inverse: "#000000",
    "inverse-content": "#FFFFFF",
    dim: "#878A90",
  },
}

// Get themes from config or use defaults
const configThemes = (appConfig as any)?.theme?.colors || {}

// Merge config themes with defaults
const colorThemes: Record<string, ThemeData> = {
  dark: {
    ...defaultThemes.dark,
    ...configThemes.dark,
  },
  light: {
    ...defaultThemes.light,
    ...configThemes.light,
  },
}

export default colorThemes
