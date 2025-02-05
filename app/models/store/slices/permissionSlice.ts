import { StateCreator } from "zustand"
import { PermissionProvider, PermissionTypes } from "../../../providers/types"

export interface PermissionState {
  // State
  permissions: Partial<PermissionTypes>
  lastPrompted: Record<keyof PermissionTypes, number>
  initialized: boolean

  // Actions
  requestPermission: (permission: keyof PermissionTypes) => Promise<boolean>
  checkPermission: (permission: keyof PermissionTypes) => Promise<boolean>
  setPermissionStatus: (permission: keyof PermissionTypes, granted: boolean) => void
  setPermissionPrompted: (permission: keyof PermissionTypes) => void
  openSettings?: () => Promise<void>

  // Provider management (internal)
  _setPermissionProvider: (provider: PermissionProvider) => void
}

export const createPermissionSlice: StateCreator<PermissionState> = (set, get) => {
  let provider: PermissionProvider | null = null

  return {
    permissions: {},
    lastPrompted: {} as Record<keyof PermissionTypes, number>,
    initialized: false,

    requestPermission: async (permission) => {
      if (!provider) return false
      const granted = await provider.request(permission)
      set((state) => ({
        permissions: {
          ...state.permissions,
          [permission]: granted,
        },
        lastPrompted: {
          ...state.lastPrompted,
          [permission]: Date.now(),
        },
      }))
      return granted
    },

    checkPermission: async (permission) => {
      if (!provider) return false
      const granted = await provider.check(permission)
      set((state) => ({
        permissions: {
          ...state.permissions,
          [permission]: granted,
        },
      }))
      return granted
    },

    setPermissionStatus: (permission, granted) =>
      set((state) => ({
        permissions: {
          ...state.permissions,
          [permission]: granted,
        },
      })),

    setPermissionPrompted: (permission) =>
      set((state) => ({
        lastPrompted: {
          ...state.lastPrompted,
          [permission]: Date.now(),
        },
      })),

    openSettings: async () => {
      if (provider?.openSettings) {
        await provider.openSettings()
      }
    },

    _setPermissionProvider: (newProvider) => {
      provider = newProvider
      set({ initialized: true })
    },
  }
}
