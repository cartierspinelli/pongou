import { StateCreator } from "zustand"
import { ReviewState } from "../../../providers/types"
import * as StoreReview from "expo-store-review"
import { Platform } from "react-native"
import { useRootStore } from "../../RootStore"

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const createReviewSlice: StateCreator<ReviewState, [], [], ReviewState> = (set, get) => ({
  lastReviewDate: 0,
  lastReviewedVersion: "",

  shouldPromptReview: () => {
    const state = get()
    const { currentVersion } = useRootStore.getState()
    return (
      state.lastReviewedVersion !== currentVersion &&
      Date.now() - state.lastReviewDate > ONE_WEEK_MS
    )
  },

  markReviewPrompted: () => {
    const { currentVersion } = useRootStore.getState()
    set({
      lastReviewDate: Date.now(),
      lastReviewedVersion: currentVersion,
    })
  },

  requestReview: async (currentVersion: string) => {
    const state = get()
    const canRequest =
      state.lastReviewedVersion !== currentVersion &&
      Date.now() - state.lastReviewDate > ONE_WEEK_MS

    if (canRequest) {
      try {
        if (Platform.OS === "ios" || Platform.OS === "android") {
          const isAvailable = await StoreReview.isAvailableAsync()
          if (isAvailable) {
            await StoreReview.requestReview()
            state.markReviewPrompted()
            return true
          }
        }
      } catch (error) {
        console.error("Failed to request review:", error)
      }
    }
    return false
  },

  setLastReviewDate: (date: number) => set({ lastReviewDate: date }),
})
