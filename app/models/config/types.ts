import { ThemeData } from "@/app/ui/theme/colors"
import { AuthProvider } from "../../providers/types"

export interface AppProviderConfig {
  basics: {
    name: string
    description: string
    icon: string | null
  }
  theme: {
    isDarkMode: boolean
    font: string
    colors: {
      light: ThemeData
      dark: ThemeData
    }
  }
  monetization: {
    plans: Record<string, unknown>
  }
  auth: {
    provider?: AuthProvider
    config?: Record<string, any>
    methods: "email" | "google" | "github" | "apple"[]
    required?: boolean
    organization?: {
      type: string
      workspaces: boolean
      teams: boolean
    }
  }
  analytics?: Array<{
    provider: "posthog" | "mixpanel" | "amplitude"
    config: Record<string, any>
  }>
  notifications?: {
    provider: "onesignal" | "firebase"
    config: Record<string, any>
  }
  tracking?: {
    provider: "smartlook" | "fullstory"
    config: Record<string, any>
    sampleRate?: number
  }
  subscription?: {
    provider: "revenuecat" | "qonversion"
    config: Record<string, any>
  }
}
