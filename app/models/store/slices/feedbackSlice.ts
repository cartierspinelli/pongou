import { StateCreator } from "zustand"
import { FeedbackState } from "../../../providers/types"

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const createFeedbackSlice: StateCreator<FeedbackState> = (set, get) => ({
  lastFeedbackPrompt: 0,
  lastFeedbackComplete: 0,
  feedbackEnabled: true,

  shouldPromptFeedback: () => {
    const state = get()
    return (
      state.feedbackEnabled &&
      Date.now() - state.lastFeedbackPrompt > ONE_WEEK_MS &&
      Date.now() - state.lastFeedbackComplete > ONE_WEEK_MS
    )
  },

  markFeedbackPrompted: () =>
    set({
      lastFeedbackPrompt: Date.now(),
    }),

  markFeedbackCompleted: () =>
    set({
      lastFeedbackComplete: Date.now(),
    }),

  setFeedbackEnabled: (enabled: boolean) =>
    set({
      feedbackEnabled: enabled,
    }),
})
