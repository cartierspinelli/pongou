import { StateCreator } from "zustand"
import { AuthProvider, AuthState } from "../../../providers/types"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/app/providers/supabase"

export const createAuthSlice: StateCreator<AuthState> = (set, get) => {
  const handleAuthStateChange = (session: Session | null) => {
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
      userId: session?.user?.id,
    })
  }

  return {
    session: null,
    user: null,
    userId: null,
    isLoading: true,
    lastError: null,

    setSession: handleAuthStateChange,
    setUser: (user: User | null) => set({ user }),
    clearUser: () => set({ user: null }),
    signOut: async () => {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        set({ lastError: error as Error })
        throw error
      }
    },

    refreshSession: async () => {
      try {
        await supabase.auth.refreshSession()
      } catch (error) {
        set({ lastError: error as Error })
        throw error
      }
    },

    signIn: async (credentials: { email: string; password: string }) => {
      try {
        await supabase.auth.signInWithPassword(credentials)
      } catch (error) {
        set({ lastError: error as Error })
        throw error
      }
    },

    signUpWithEmail: async (credentials: { email: string; password: string }) => {
      try {
        await supabase.auth.signUp(credentials)
      } catch (error) {
        set({ lastError: error as Error })
        throw error
      }
    },

    resetPassword: async (email: string) => {
      try {
        await supabase.auth.resetPasswordForEmail(email)
      } catch (error) {
        set({ lastError: error as Error })
        throw error
      }
    },

    setAuthError: (error) => set({ lastError: error }),
    getAuthToken: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session?.access_token ?? ""
    },
    clearError: () => set({ lastError: null }),
  }
}
