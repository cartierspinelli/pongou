import { AppProviderConfig } from "./types"

export const loadAppConfig = (): AppProviderConfig | null => {
  try {
    // Try to load production config first
    const appConfig = require("@/a0/config/app.config.json")
    return appConfig as AppProviderConfig
  } catch (error) {
    try {
      // Fall back to dev config if production config doesn't exist
      const devConfig = require("./app.config.dev.json")
      return devConfig as AppProviderConfig
    } catch (error) {
      return null
    }
  }
}
