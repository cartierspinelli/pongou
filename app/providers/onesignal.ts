// import { LogLevel, OneSignal } from "react-native-onesignal"
import { PermissionProvider, PermissionTypes } from "./types"

export class OneSignalProvider implements PermissionProvider {
  constructor() {}
  // private oneSignal = OneSignal

  async initialize() {
    throw new Error("OneSignal is not supported on this platform")
    // this.oneSignal.Debug.setLogLevel(LogLevel.Verbose)
    // this.oneSignal.initialize("your-onesignal-id")
  }

  async request(permission: keyof PermissionTypes): Promise<boolean> {
    // if (permission === "notifications") {
    //   return await this.oneSignal.Notifications.requestPermission(false)
    // }
    return false
  }

  async check(permission: keyof PermissionTypes): Promise<boolean> {
    // if (permission === "notifications") {
    //   return await this.oneSignal.Notifications.hasPermission()
    // }
    return false
  }
}
