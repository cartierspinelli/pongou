import { useRootStore } from "@/app/models/RootStore"

// Create a base URL for API requests
const baseURL = process.env.API_URL || "http://localhost:3001/api"

// Helper function to add auth token and make requests
const api = {
  request: async (endpoint: string, options: RequestInit = {}) => {
    // Get auth token
    const rootStore = useRootStore.getState()
    const authToken = await rootStore.getAuthToken()

    // Merge default and provided headers
    const headers = {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    }

    // Construct full URL
    const url = `${baseURL}${endpoint}`

    // Make request with merged options
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-2xx responses
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // Parse JSON response
    return response.json()
  },
}

export default api
