import { StateCreator } from "zustand"
import { SubscriptionProvider, PurchaseProduct, Entitlement } from "../../../providers/types"

export interface SubscriptionState {
  // State
  availableProducts: PurchaseProduct[]
  entitlements: Record<string, Entitlement>
  isLoading: boolean
  error: string | null

  // Public actions
  purchase: (productId: string) => Promise<boolean>
  restore: () => Promise<boolean>
  hasEntitlement: (id: string) => boolean
  isSubscriptionActive: () => boolean

  // Internal actions
  _setSubscriptionProvider: (provider: SubscriptionProvider) => void
  setAvailableProducts: (products: PurchaseProduct[]) => void
  setEntitlements: (entitlements: Record<string, Entitlement>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const createSubscriptionSlice: StateCreator<SubscriptionState> = (set, get) => {
  let provider: SubscriptionProvider | null = null

  return {
    availableProducts: [],
    entitlements: {},
    isLoading: false,
    error: null,

    purchase: async (productId) => {
      if (!provider) return false
      set({ isLoading: true })
      try {
        const success = await provider.purchase(productId)
        if (success) {
          const entitlements = await provider.getEntitlements()
          set({ entitlements })
        }
        return success
      } catch (error) {
        set({ error: String(error) })
        return false
      } finally {
        set({ isLoading: false })
      }
    },

    restore: async () => {
      if (!provider) return false
      set({ isLoading: true })
      try {
        const success = await provider.restore()
        if (success) {
          const entitlements = await provider.getEntitlements()
          set({ entitlements })
        }
        return success
      } catch (error) {
        set({ error: String(error) })
        return false
      } finally {
        set({ isLoading: false })
      }
    },

    hasEntitlement: (id) => {
      return get().entitlements[id]?.isActive ?? false
    },

    isSubscriptionActive: () => {
      return Object.values(get().entitlements).some(
        (entitlement) => entitlement.isActive && entitlement.source === "subscription",
      )
    },

    _setSubscriptionProvider: (newProvider) => {
      provider = newProvider
    },

    setAvailableProducts: (products) => set({ availableProducts: products }),
    setEntitlements: (entitlements) => set({ entitlements }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
  }
}
