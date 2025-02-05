import {
  AnalyticsProvider,
  PermissionProvider,
  SubscriptionProvider,
  TrackingProvider,
} from "./types"

export class ProviderContainer {
  private static instance: ProviderContainer

  private analyticsProviders: AnalyticsProvider[] = []
  private permissionProviders: PermissionProvider[] = []
  private trackingProvider?: TrackingProvider
  private subscriptionProvider?: SubscriptionProvider

  private constructor() {}

  static getInstance(): ProviderContainer {
    if (!ProviderContainer.instance) {
      ProviderContainer.instance = new ProviderContainer()
    }
    return ProviderContainer.instance
  }

  setAnalyticsProviders(providers: AnalyticsProvider[]) {
    this.analyticsProviders = providers
  }

  setPermissionProviders(providers: PermissionProvider[]) {
    this.permissionProviders = providers
  }

  setTrackingProvider(provider: TrackingProvider) {
    this.trackingProvider = provider
  }

  setSubscriptionProvider(provider: SubscriptionProvider) {
    this.subscriptionProvider = provider
  }

  getAnalyticsProviders() {
    return this.analyticsProviders
  }

  getPermissionProviders() {
    return this.permissionProviders
  }

  getTrackingProvider() {
    return this.trackingProvider
  }

  getSubscriptionProvider() {
    return this.subscriptionProvider
  }
}

export const providers = ProviderContainer.getInstance()
