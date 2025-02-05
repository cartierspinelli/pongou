import { StateCreator } from "zustand"
import { TrackingProvider } from "../../../providers/types"

export interface TrackingState {
  // State
  initialized: boolean
  isTracking: boolean

  // Actions
  startTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  setUserIdentifier: (identifier: string) => void

  // Provider management (internal)
  _setTrackingProvider: (provider: TrackingProvider) => void
}

export const createTrackingSlice: StateCreator<TrackingState> = (set, get) => {
  let provider: TrackingProvider | null = null

  return {
    initialized: false,
    isTracking: false,

    startTracking: async () => {
      if (provider) {
        await provider.start()
        set({ isTracking: true })
      }
    },

    stopTracking: async () => {
      if (provider) {
        await provider.stop()
        set({ isTracking: false })
      }
    },

    setUserIdentifier: (identifier) => {
      if (provider && provider.setUserIdentifier) {
        provider.setUserIdentifier(identifier)
      }
    },

    _setTrackingProvider: (newProvider) => {
      provider = newProvider
      set({ initialized: true })
    },
  }
}
