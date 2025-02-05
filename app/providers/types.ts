import { User } from "@supabase/supabase-js"

import { Session } from "@supabase/supabase-js"

export interface ProviderConfig {
  analytics?: {
    providers: AnalyticsProvider[]
  }
  permissions?: {
    providers: PermissionProvider[]
  }
  auth?: {
    provider: AuthProvider
  }
  tracking?: {
    provider: TrackingProvider
    shouldInitialize?: () => boolean
  }
  subscription?: {
    provider: SubscriptionProvider
    config: any
  }
}

export interface AnalyticsProvider {
  initialize: () => Promise<void>
  identify: (userId?: string, traits?: Record<string, any>) => void
  track: (eventName: string, properties?: Record<string, any>) => void
  reset: () => void
}

export interface TrackingProvider {
  initialize: () => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
  setUserIdentifier?: (identifier: string) => void
}

export interface PermissionProvider {
  initialize: () => Promise<void>
  request: (permission: keyof PermissionTypes) => Promise<boolean>
  check: (permission: keyof PermissionTypes) => Promise<boolean>
  openSettings?: () => Promise<void>
}

export interface SubscriptionProvider {
  initialize: (config: any) => Promise<void>
  getProducts: () => Promise<PurchaseProduct[]>
  getEntitlements: () => Promise<Record<string, Entitlement>>
  purchase: (productId: string) => Promise<boolean>
  restore: () => Promise<boolean>
  manageSubscriptions?: () => Promise<void>
  presentCodeRedemption?: () => Promise<void>
}

export interface PurchaseProduct {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  type: "subscription" | "consumable" | "non_consumable"
  period?: string
  features?: string[]
}

export interface Entitlement {
  id: string
  isActive: boolean
  willRenew?: boolean
  expirationDate?: Date
  source?: "subscription" | "purchase" | "trial"
}

export interface PermissionTypes {
  notifications: boolean
  camera: boolean
  location: boolean
  photos: boolean
  microphone: boolean
  contacts: boolean
  [key: string]: boolean
}

export interface UIState {
  modals: Record<string, boolean>
  setModalVisible: (modalId: string, visible: boolean) => void
}

export interface AppState extends Record<string, any> {
  launchCount: number
  lastVersion: string
  currentVersion: string
  onboardingComplete: boolean
  increaseLaunchCount: () => void
  setOnboardingComplete: (complete: boolean) => void
  updateLastVersion: () => void
}

export interface FeedbackState {
  lastFeedbackPrompt: number
  lastFeedbackComplete: number
  feedbackEnabled: boolean
  shouldPromptFeedback: () => boolean
  markFeedbackPrompted: () => void
  markFeedbackCompleted: () => void
  setFeedbackEnabled: (enabled: boolean) => void
}

export interface ReviewState {
  lastReviewDate: number
  lastReviewedVersion: string
  shouldPromptReview: () => boolean
  markReviewPrompted: () => void
  requestReview: (currentVersion: string) => Promise<boolean>
  setLastReviewDate: (date: number) => void
}

export interface AnalyticsState {
  initialized: boolean
  track: (eventName: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  reset: () => void
  _setAnalyticsProvider: (provider: AnalyticsProvider) => void
}

export interface TrackingState {
  initialized: boolean
  isTracking: boolean
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  setUserIdentifier: (identifier: string) => void
  _setTrackingProvider: (provider: TrackingProvider) => void
}

export interface SubscriptionState {
  availableProducts: PurchaseProduct[]
  entitlements: Record<string, Entitlement>
  isLoading: boolean
  error: string | null
  purchase: (productId: string) => Promise<boolean>
  restore: () => Promise<boolean>
  hasEntitlement: (id: string) => boolean
  isSubscriptionActive: () => boolean
  _setSubscriptionProvider: (provider: SubscriptionProvider) => void
  setAvailableProducts: (products: PurchaseProduct[]) => void
  setEntitlements: (entitlements: Record<string, Entitlement>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export interface PermissionState {
  permissions: Partial<PermissionTypes>
  lastPrompted: Record<keyof PermissionTypes, number>
  initialized: boolean
  requestPermission: (permission: keyof PermissionTypes) => Promise<boolean>
  checkPermission: (permission: keyof PermissionTypes) => Promise<boolean>
  setPermissionStatus: (permission: keyof PermissionTypes, granted: boolean) => void
  setPermissionPrompted: (permission: keyof PermissionTypes) => void
  openSettings?: () => Promise<void>
  _setPermissionProvider: (provider: PermissionProvider) => void
}

export interface AuthProvider {
  initialize: () => Promise<void>
  signUp: (credentials: { email: string; password: string }) => Promise<void>
  signIn: (credentials: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  getAuthToken: () => Promise<string>
}

export interface AuthState {
  session: Session | null
  user: User | null
  userId: string | null
  isLoading: boolean
  lastError: Error | null

  // Core actions
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  clearUser: () => void
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  getAuthToken: () => Promise<string>

  // Error handling
  setAuthError: (error: Error | null) => void
  clearError: () => void
}
