// import Smartlook from "react-native-smartlook-analytics"
import { TrackingProvider } from "./types"

export class SmartlookProvider implements TrackingProvider {
  constructor(private apiKey: string) {}

  async initialize() {
    throw new Error("Smartlook is not supported on this platform")
    // Smartlook.instance.preferences.setProjectKey(this.apiKey)
    // Smartlook.instance.sensitivity.disableDefaultClassSensitivity()
  }

  async start() {
    // await Smartlook.instance.start()
  }

  async stop() {
    // await Smartlook.instance.stop()
  }

  setUserIdentifier(identifier: string) {
    // Smartlook.instance.user.setIdentifier(identifier)
  }
}
