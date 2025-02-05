import { useEffect, useState } from "react"
import { useRootStore } from "../RootStore"
import { setupRootStore } from "./setupRootStore"
import { Alert, Platform } from "react-native"
import {
  AnalyticsProvider,
  AuthProvider,
  PermissionProvider,
  SubscriptionProvider,
  TrackingProvider,
} from "../../providers/types"
import uuid from "react-native-uuid"
import { load, save, remove } from "@/app/utils/storage/storage"
import { loadAppConfig } from "../config/configLoader"
import { convertConfigToOptions } from "../config/providerFactory"
import { supabase } from "@/app/providers/supabase"

export interface InitializationOptions {
  analytics?: Array<{
    name: string
    provider: AnalyticsProvider
  }>

  notifications?: {
    provider: PermissionProvider
  }
  tracking?: {
    provider: TrackingProvider
    shouldInitialize?: () => boolean
  }
  subscription?: {
    provider: SubscriptionProvider
    config: any
  }
}

export const deleteDefaultUser = async () => {
  remove("credentials")
}

export const createNewUser = async (): Promise<void> => {
  try {
    console.log("Creating New User")
    const email = `${uuid.v4()}@anon-users.a0.dev`
    const password = uuid.v4() as string

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw error
    }

    console.log("Creating User", email, password)
    save("credentials", { username: email, password })
    console.log("Saved profile to MMKV storage")
    return
  } catch (error) {
    // console.error("Failed to create new user:", error)
    throw error
  }
}

export const loginDefaultUser = async (): Promise<void> => {
  try {
    // Retrieve the stored stringified credentials
    const credentials = (await load("credentials")) as
      | { username: string; password: string }
      | undefined

    if (credentials && credentials.username && credentials.password) {
      console.log(`Credentials successfully loaded for user ${credentials.username}`)

      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      })

      if (error) {
        console.error("Failed to sign in with password:", error)
        throw error
      }

      console.log(credentials)
      console.log(credentials.password)

      console.log("Logged in with Secure Store")
      return
    } else {
      await createNewUser()
      return
    }
  } catch (error: any) {
    // Sentry.captureException(error)
    console.log(error)
    // Alert.alert("App Login Failed", "Please check your connection and restart the app.")
    // throw new Error(error.message || "An error occurred")
  }
}

/**
 * Used only in the app.tsx file, this hook sets up the RootStore
 * and then rehydrates it.
 */
export const useInitialRootStore = (callback?: () => void | Promise<void>) => {
  const rootStore = useRootStore()
  const [rehydrated, setRehydrated] = useState(false)

  const { setSession, setUser, logout } = useRootStore()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(session)
        setUser(session.user)
      } else {
        console.log("Logging out")
        await logout()
      }
    })

    const initializeApp = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
        setUser(session.user)
      } else if (error) {
        // console.error("Error getting session:", error)
        logout()
      }
      const loadStart = Date.now()
      const config = loadAppConfig()
      const options = config ? convertConfigToOptions(config) : {}
      console.log("Loading app")
      try {
        // Rehydrate the store
        await setupRootStore()

        // Initialize subscription system
        if (options?.subscription) {
          const { provider, config } = options.subscription
          rootStore.setLoading(true)

          try {
            await provider.initialize(config)

            // Get initial state
            const [products, entitlements] = await Promise.all([
              provider.getProducts(),
              provider.getEntitlements(),
            ])

            rootStore.setAvailableProducts(products)
            rootStore.setEntitlements(entitlements)
          } catch (error) {
            rootStore.setError(String(error))
          } finally {
            rootStore.setLoading(false)
          }
        }

        // Initialize tracking if configured
        if (options?.tracking) {
          const shouldInit = options.tracking.shouldInitialize?.() ?? true
          if (shouldInit || __DEV__) {
            await options.tracking.provider.initialize()
          }
        }

        // Initialize analytics providers
        if (options?.analytics?.length) {
          await Promise.all(
            options.analytics.map(async (provider) => {
              try {
                await provider.provider.initialize()
              } catch (error) {
                console.error(`Failed to initialize ${provider.name}:`, error)
              }
            }),
          )
        }

        // Initialize notifications
        if (options?.notifications) {
          await options.notifications.provider.initialize()
        }

        try {
          const credentials = load("credentials") as
            | { username: string; password: string }
            | undefined

          if (credentials && credentials.username && credentials.password) {
            console.log(credentials.username, "Device Account")
            // rootStore.setDeviceAccount(credentials.username)
          }
          // if (!loginRequired) {
          // console.log("rootStore.userId", rootStore.userId)
          // if (!rootStore.userId) {
          //   await loginDefaultUser()
          // }
          // }
        } catch (error) {
          // console.error("Failed to initialize auth provider:", error)
        }

        // Track launch
        rootStore.track("app_launched", {
          platform: Platform.OS,
          version: rootStore.currentVersion,
        })
      } catch (error) {
        // console.error("Initialization error:", error)
        rootStore.track("init_error", { error: String(error) })
      } finally {
        console.log("Rehydrated")
        setRehydrated(true)
        rootStore.increaseLaunchCount()
        rootStore.track("app_load_complete", {
          duration: Date.now() - loadStart,
        })

        if (callback) {
          console.log("Calling callback")
          await callback()
        }
      }
    }

    initializeApp()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { rehydrated }
}
