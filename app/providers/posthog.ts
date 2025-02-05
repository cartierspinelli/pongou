import { AnalyticsProvider } from "./types"
import PostHog from "posthog-react-native"

const posthog = new PostHog("phc_DdvL7FxmJIK7ObOhOKw9FUS5jNUGixULe8hg8r2IdVV", {
  // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
  host: "https://us.i.posthog.com", // host is optional if you use https://us.i.posthog.com
  customAppProperties(properties) {
    return properties
  },
  flushAt: 1,
  flushInterval: 10000,
})
export class PostHogProvider implements AnalyticsProvider {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async initialize() {
    console.log("Initializing PostHog")
  }

  identify(userId?: string, traits?: Record<string, any>) {
    posthog.identify(userId, traits)
  }

  track(eventName: string, properties?: Record<string, any>) {
    posthog.capture(eventName, properties)
  }

  reset() {
    posthog.reset()
  }
}
