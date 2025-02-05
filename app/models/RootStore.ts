import { create } from "zustand"
import { persist } from "zustand/middleware"
import { storage } from "../utils/storage/storage"
import { createUISlice } from "./store/slices/uiSlice"
import { createAppSlice } from "./store/slices/appSlice"
import { createPermissionSlice } from "./store/slices/permissionSlice"
import { createReviewSlice } from "./store/slices/reviewSlice"
import { createFeedbackSlice } from "./store/slices/feedbackSlice"
import { createSubscriptionSlice } from "./store/slices/subscriptionSlice"
import { createAnalyticsSlice } from "./store/slices/analyticsSlice"
import { createTrackingSlice } from "./store/slices/trackingSlice"
import { createAuthSlice } from "./store/slices/authSlice"
import {
  UIState,
  AppState,
  PermissionState,
  ReviewState,
  FeedbackState,
  SubscriptionState,
  AnalyticsState,
  TrackingState,
  AuthState,
} from "../providers/types"

// Define the complete store type
interface RootStore
  extends UIState,
    AppState,
    PermissionState,
    ReviewState,
    FeedbackState,
    SubscriptionState,
    AnalyticsState,
    TrackingState,
    AuthState {}

const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ? JSON.parse(value) : null
  },
  setItem: (name: string, value: any) => {
    storage.set(name, JSON.stringify(value))
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
}

// Create the store with all slices
export const useRootStore = create<RootStore>()(
  persist(
    (...a) => {
      const state = {
        ...createUISlice(...a),
        ...createAppSlice(...a),
        ...createPermissionSlice(...a),
        ...createReviewSlice(...a),
        ...createFeedbackSlice(...a),
        ...createSubscriptionSlice(...a),
        ...createAnalyticsSlice(...a),
        ...createTrackingSlice(...a),
        ...createAuthSlice(...a),
      }
      console.log("Initial store state:", state) // Debug log
      return state
    },
    {
      name: "root-storage",
      storage: zustandStorage,
      onRehydrateStorage: (state) => {
        return (state) => {
          console.log("Rehydrated state:", state) // Debug log
        }
      },
      partialize: (state) => {
        const partialState = {
          // App state
          launchCount: state.launchCount,
          lastVersion: state.lastVersion,
          currentVersion: state.currentVersion,
          onboardingComplete: state.onboardingComplete,
          // Review state
          lastReviewDate: state.lastReviewDate,
          lastReviewedVersion: state.lastReviewedVersion,
          // Feedback state
          lastFeedbackPrompt: state.lastFeedbackPrompt,
          lastFeedbackComplete: state.lastFeedbackComplete,
          feedbackEnabled: state.feedbackEnabled,
          // Permission state
          permissions: state.permissions,
          lastPrompted: state.lastPrompted,
          // Subscription state
          entitlements: state.entitlements,
          // Auth state
          userId: state.userId,
        }
        return partialState
      },
    },
  ),
)

// Export the store type for use in other files
export type { RootStore }
