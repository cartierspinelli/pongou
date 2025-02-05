/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { useRootStore } from "../RootStore"
import * as storage from "../../utils/storage"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root-v1"

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  try {
    // load the last known state from AsyncStorage
    const restoredState = storage.load(ROOT_STATE_STORAGE_KEY)

    if (restoredState) {
      // Get current state which includes defaults
      const currentState = useRootStore.getState()
      // Merge restored state with current state (preserving defaults)
      useRootStore.setState({
        ...currentState,
        ...restoredState,
      })
    }
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    if (__DEV__) {
      if (e instanceof Error) console.error(e.message)
    }
  }

  // Subscribe to state changes
  useRootStore.subscribe((state) => {
    storage.save(ROOT_STATE_STORAGE_KEY, state)
  })
}
