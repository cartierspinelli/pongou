import { StateCreator } from "zustand"
import { AnalyticsProvider } from "../../../providers/types"

export interface AnalyticsState {
  // State
  initialized: boolean

  // Actions
  track: (eventName: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  reset: () => void

  // Provider management (internal)
  _setAnalyticsProvider: (provider: AnalyticsProvider) => void
}

export const createAnalyticsSlice: StateCreator<AnalyticsState> = (set, get) => {
  let provider: AnalyticsProvider | null = null

  return {
    initialized: false,

    track: (eventName, properties) => {
      if (provider) {
        provider.track(eventName, properties)
      }
    },

    identify: (userId, traits) => {
      if (provider) {
        provider.identify(userId, traits)
      }
    },

    reset: () => {
      if (provider) {
        provider.reset()
      }
    },

    _setAnalyticsProvider: (newProvider) => {
      provider = newProvider
      set({ initialized: true })
    },
  }
}
