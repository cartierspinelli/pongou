import { create } from 'zustand'
import { produce } from 'immer'
import { saveString, loadString } from '@/app/utils/storage/storage'
import { useRootStore } from '@/app/models/RootStore'
import { useGameStore } from '@/lib/GameStore'
import { useWalletStore } from '@/lib/WalletStore'
import { User, Match, Wallet, MatchSettings } from '@/app/types/global'
import uuid from 'react-native-uuid'

const STORAGE_KEY = 'user_store_v1'

export interface UserStoreState {
  error: string | null
  users: Record<string, User>
  isLoading: boolean
  userStats: Record<string, { rank: number; winRate: number; avgStake: number }>
  currentUser: User | null
  lastUpdated: Date | null
  userPreferences: Record<string, {
    notifications: boolean
    theme: 'light' | 'dark'
    soundEnabled: boolean
  }>
  matchHistory: Record<string, string[]> // userId -> matchIds
  cachedLeaderboard: Array<{ userId: string; rank: number; winRate: number }> | null
  cachedLeaderboardExpiry: Date | null
}

export interface UserStoreActions {
  updateStats: (userId: string, matchResult: { won: boolean; stake: number }) => Promise<void>
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>
  fetchLeaderboard: () => Promise<Array<{ userId: string; rank: number; winRate: number }>>
  initializeUser: (userData: Omit<User, 'id'>) => Promise<string>
  updateUserPreferences: (userId: string, preferences: Partial<UserStoreState['userPreferences'][string]>) => void
  addMatchToHistory: (userId: string, matchId: string) => void
  calculateRank: (userId: string) => number
  setError: (error: string | null) => void
  clearCache: () => void
}

export type UserStore = UserStoreState & UserStoreActions

const initialState: UserStoreState = {
  error: null,
  users: {},
  isLoading: false,
  userStats: {},
  currentUser: null,
  lastUpdated: null,
  userPreferences: {},
  matchHistory: {},
  cachedLeaderboard: null,
  cachedLeaderboardExpiry: null
}

const LEADERBOARD_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const persistState = async (state: UserStoreState) => {
  const persistedData = {
    users: state.users,
    userStats: state.userStats,
    userPreferences: state.userPreferences,
    matchHistory: state.matchHistory,
    lastUpdated: state.lastUpdated
  }
  await saveString(STORAGE_KEY, JSON.stringify(persistedData))
}

const loadPersistedState = async (): Promise<Partial<UserStoreState>> => {
  const stored = await loadString(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  updateStats: async (userId, matchResult) => {
    set(produce((state: UserStoreState) => {
      const user = state.users[userId]
      if (!user) return

      user.wins += matchResult.won ? 1 : 0
      user.losses += matchResult.won ? 0 : 1
      user.totalMatches += 1

      const stats = state.userStats[userId] || { rank: 0, winRate: 0, avgStake: 0 }
      stats.winRate = (user.wins / user.totalMatches) * 100
      stats.avgStake = ((stats.avgStake * (user.totalMatches - 1) + matchResult.stake) / user.totalMatches)
      
      state.userStats[userId] = stats
      state.lastUpdated = new Date()
    }))
    await persistState(get())
  },

  updateProfile: async (userId, updates) => {
    set(produce((state: UserStoreState) => {
      if (!state.users[userId]) return
      Object.assign(state.users[userId], updates)
      state.lastUpdated = new Date()
    }))
    await persistState(get())
  },

  fetchLeaderboard: async () => {
    const state = get()
    const now = new Date()

    if (state.cachedLeaderboard && state.cachedLeaderboardExpiry && state.cachedLeaderboardExpiry > now) {
      return state.cachedLeaderboard
    }

    const leaderboard = Object.entries(state.users)
      .map(([userId, user]) => ({
        userId,
        rank: state.userStats[userId]?.rank || 0,
        winRate: state.userStats[userId]?.winRate || 0
      }))
      .sort((a, b) => b.winRate - a.winRate)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    set(produce((state: UserStoreState) => {
      state.cachedLeaderboard = leaderboard
      state.cachedLeaderboardExpiry = new Date(now.getTime() + LEADERBOARD_CACHE_DURATION)
    }))

    return leaderboard
  },

  initializeUser: async (userData) => {
    const userId = uuid.v4() as string
    const newUser: User = {
      id: userId,
      wins: 0,
      losses: 0,
      totalMatches: 0,
      reputation: 100,
      createdAt: new Date(),
      lastActive: new Date(),
      ...userData
    }

    set(produce((state: UserStoreState) => {
      state.users[userId] = newUser
      state.userStats[userId] = {
        rank: 0,
        winRate: 0,
        avgStake: 0
      }
      state.userPreferences[userId] = {
        notifications: true,
        theme: 'light',
        soundEnabled: true
      }
      state.matchHistory[userId] = []
      state.lastUpdated = new Date()
    }))

    await persistState(get())
    return userId
  },

  updateUserPreferences: (userId, preferences) => {
    set(produce((state: UserStoreState) => {
      if (!state.userPreferences[userId]) return
      Object.assign(state.userPreferences[userId], preferences)
    }))
  },

  addMatchToHistory: (userId, matchId) => {
    set(produce((state: UserStoreState) => {
      if (!state.matchHistory[userId]) {
        state.matchHistory[userId] = []
      }
      state.matchHistory[userId].unshift(matchId)
    }))
  },

  calculateRank: (userId) => {
    const state = get()
    const stats = state.userStats[userId]
    if (!stats) return 0
    return Math.floor((stats.winRate * 0.6 + (stats.avgStake / 100) * 0.4) * 100)
  },

  setError: (error) => set({ error }),

  clearCache: () => {
    set(produce((state: UserStoreState) => {
      state.cachedLeaderboard = null
      state.cachedLeaderboardExpiry = null
    }))
  }
}))

// Initialize store with persisted state
loadPersistedState().then((persistedState) => {
  useUserStore.setState({
    ...initialState,
    ...persistedState
  })
})