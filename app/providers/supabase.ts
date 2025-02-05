import { Database } from "@/a0/supabase/supabase-types"
import { AuthProvider } from "./types"
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js"
import { MMKV } from "react-native-mmkv"

interface SupabaseConfig {
  url: string
  anonKey: string
  storage?: MMKV
  onAuthStateChange?: (session: Session | null) => void
}

const storage = new MMKV({ id: "supabase-storage" })
const mmkvSupabaseSupportedStorage = {
  setItem: (key: string, data: string) => storage.set(key, data),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),
}

export const supabase = createClient<Database>("http://localhost:8000", "main-template", {
  auth: {
    storage: mmkvSupabaseSupportedStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
