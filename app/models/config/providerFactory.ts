import { AppProviderConfig } from "./types"
import { SupabaseAuthProvider } from "../../providers/supabase"
import { PostHogProvider } from "../../providers/posthog"
import { RevenueCatProvider } from "../../providers/revenuecat"
import { OneSignalProvider } from "../../providers/onesignal"
import { InitializationOptions } from "../helpers/useStores"
import { SmartlookProvider } from "../../providers/smartlook"

export const getTrackingProvider = (
  config: AppProviderConfig["tracking"],
): InitializationOptions["tracking"] | null => {
  return null

  // switch (config.provider) {
  //   case "smartlook":
  //     return {
  //       provider: new SmartlookProvider(config.config.apiKey),
  //       shouldInitialize: () => Math.random() < (config.sampleRate ?? 1),
  //     }
  //   default:
  //     throw new Error(`Unknown tracking provider: ${config.provider}`)
  // }
}

export const getAnalyticsProviders = (
  configs: AppProviderConfig["analytics"],
): InitializationOptions["analytics"] => {
  if (!configs?.length) return undefined

  return configs.map((config) => {
    switch (config.provider) {
      case "posthog":
        return {
          name: "posthog",
          provider: new PostHogProvider(config.config.apiKey),
        }
      default:
        throw new Error(`Unknown analytics provider: ${config.provider}`)
    }
  })
}

export const getNotificationProviders = (
  config: AppProviderConfig["notifications"],
): InitializationOptions["notifications"] | null => {
  if (!config) return null

  return {
    provider: new OneSignalProvider(),
  }
}

export const getSubscriptionProvider = (config: AppProviderConfig["subscription"]) => {
  if (!config) return null

  switch (config.provider) {
    case "revenuecat":
      return {
        provider: new RevenueCatProvider(),
        config: config.config,
      }
    default:
      throw new Error(`Unknown subscription provider: ${config.provider}`)
  }
}

export const convertConfigToOptions = (config: AppProviderConfig): InitializationOptions => {
  const options: InitializationOptions = {}

  // Tracking
  const trackingConfig = getTrackingProvider(config.tracking)
  if (trackingConfig) {
    options.tracking = trackingConfig
  }

  // Permissions
  const notificationProvider = getNotificationProviders(config.notifications)
  if (notificationProvider) {
    options.notifications = notificationProvider
  }

  // Analytics
  const analyticsProviders = getAnalyticsProviders(config.analytics)
  if (analyticsProviders) {
    options.analytics = analyticsProviders
  }

  // Subscription
  const subscriptionConfig = getSubscriptionProvider(config.subscription)
  if (subscriptionConfig) {
    options.subscription = subscriptionConfig
  }

  return options
}
