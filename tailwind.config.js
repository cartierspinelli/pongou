/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "rgb(var(--color-primary) / <alpha-value>)",
        "primary-content": "rgb(var(--color-primary-content) / <alpha-value>)",
        "secondary": "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-content": "rgb(var(--color-secondary-content) / <alpha-value>)",
        "accent": "rgb(var(--color-accent) / <alpha-value>)",
        "accent-content": "rgb(var(--color-accent-content) / <alpha-value>)",
        "neutral": "rgb(var(--color-neutral) / <alpha-value>)",
        "neutral-content": "rgb(var(--color-neutral-content) / <alpha-value>)",
        "background": "rgb(var(--color-background) / <alpha-value>)",
        "base-100": "rgb(var(--color-base-100) / <alpha-value>)",
        "base-200": "rgb(var(--color-base-200) / <alpha-value>)",
        "base-300": "rgb(var(--color-base-300) / <alpha-value>)",
        "dim": "rgb(var(--color-dim) / <alpha-value>)",
        "base-content": "rgb(var(--color-base-content) / <alpha-value>)",
        "info": "rgb(var(--color-info) / <alpha-value>)",
        "info-content": "rgb(var(--color-info-content) / <alpha-value>)",
        "success": "rgb(var(--color-success) / <alpha-value>)",
        "success-content": "rgb(var(--color-success-content) / <alpha-value>)",
        "warning": "rgb(var(--color-warning) / <alpha-value>)",
        "warning-content": "rgb(var(--color-warning-content) / <alpha-value>)",
        "error": "rgb(var(--color-error) / <alpha-value>)",
        "error-content": "rgb(var(--color-error-content) / <alpha-value>)",
        "white": "rgb(var(--color-white) / <alpha-value>)",
        "black": "rgb(var(--color-black) / <alpha-value>)",
        "card": "rgb(var(--color-card) / <alpha-value>)",
        "border": "rgb(var(--color-border) / <alpha-value>)",
        "inverse": "rgb(var(--color-inverse) / <alpha-value>)",
        "inverse-content": "rgb(var(--color-inverse-content) / <alpha-value>)",
      },
      padding: {
        "sides": "14px",
      },
      margin: {
        "sides": "14px",
      },
      fontFamily: {
        "poppins-light": ["Poppins_300Light"],
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
      },
    },
  },
  plugins: [],
}