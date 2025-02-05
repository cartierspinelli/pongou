import { StateCreator } from "zustand"
import { AppState } from "../../../providers/types"
import { Platform } from "react-native"
import Constants from "expo-constants"

const getCurrentVersion = () => {
  return (
    Platform.select({
      ios: Constants.expoConfig?.version,
      android: Constants.expoConfig?.version,
    }) ?? "1.0.0"
  )
}

export const createAppSlice: StateCreator<AppState> = (set) => ({
  launchCount: 0,
  lastVersion: "",
  currentVersion: getCurrentVersion(),
  onboardingComplete: false,

  increaseLaunchCount: () => set((state) => ({ launchCount: state.launchCount + 1 })),

  setOnboardingComplete: (complete: boolean) => set({ onboardingComplete: complete }),

  updateLastVersion: () => set((state) => ({ lastVersion: state.currentVersion })),
})
