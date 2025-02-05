import { create } from "zustand"
import { produce } from 'immer'
import { saveString, loadString } from "@/app/utils/storage/storage"
import { useRootStore } from "@/app/models/RootStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
import { User, Match, Wallet, MatchSettings } from "@/app/types/global"
import uuid from 'react-native-uuid'

// Additional types for game state management
export interface GameState {
  ballPosition: { x: number; y: number }
  player1Position: number
  player2Position: number
  scores: { player1: number; player2: number }
  lastUpdate: number
}

export interface GameStoreState {
  error: string | null
  isLoading: boolean
  gameStates: Record<string, GameState>
  activeMatches: Record<string, Match>
  matchSettings: Record<string, MatchSettings>
  matchHistory: Record<string, Match>
  pendingMatches: Record<string, Match>
  playerReadyStatus: Record<string, Set<string>>
}

export interface GameStoreActions {
  endMatch: (matchId: string, winner: string) => Promise<void>
  createMatch: (matchData: Omit<Match, 'id'>) => Promise<string>
  updateGameState: (matchId: string, gameState: Partial<GameState>) => void
  forfeitMatch: (matchId: string, forfeitingPlayerId: string) => Promise<void>
  joinMatch: (matchId: string, playerId: string) => Promise<void>
  leaveMatch: (matchId: string, playerId: string) => Promise<void>
  setPlayerReady: (matchId: string, playerId: string) => void
  resetMatch: (matchId: string) => void
  updateMatchSettings: (matchId: string, settings: Partial<MatchSettings>) => void
}

export type GameStore = GameStoreState & GameStoreActions

const STORAGE_KEY = 'game_store_v1'
const MAX_HISTORY_ITEMS = 100

const initialState: GameStoreState = {
  error: null,
  isLoading: false,
  gameStates: {},
  activeMatches: {},
  matchSettings: {},
  matchHistory: {},
  pendingMatches: {},
  playerReadyStatus: {},
}

const loadPersistedState = async (): Promise<Partial<GameStoreState>> => {
  try {
    const stored = await loadString(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load persisted state:', error)
    return {}
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  createMatch: async (matchData) => {
    const userId = useRootStore.getState().userId
    if (!userId) throw new Error('User not authenticated')

    const walletStore = useWalletStore.getState()
    const userWallet = walletStore.wallets[userId]

    if (!userWallet || userWallet.balance < matchData.stakeAmount) {
      throw new Error('Insufficient funds')
    }

    const matchId = uuid.v4().toString()
    
    set(produce((state: GameStoreState) => {
      state.pendingMatches[matchId] = {
        ...matchData,
        id: matchId,
        status: 'pending',
        winner: '',
        createdAt: new Date(),
        startedAt: new Date(),
        endedAt: new Date(),
        player1Score: 0,
        player2Score: 0,
      }
    }))

    await walletStore.placeBet(userId, matchId, matchData.stakeAmount)
    await saveString(STORAGE_KEY, JSON.stringify(get()))
    
    return matchId
  },

  updateGameState: (matchId, gameState) => {
    set(produce((state: GameStoreState) => {
      state.gameStates[matchId] = {
        ...(state.gameStates[matchId] || {
          ballPosition: { x: 0.5, y: 0.5 },
          player1Position: 0.5,
          player2Position: 0.5,
          scores: { player1: 0, player2: 0 },
          lastUpdate: Date.now(),
        }),
        ...gameState,
        lastUpdate: Date.now(),
      }
    }))
  },

  endMatch: async (matchId, winner) => {
    const state = get()
    const match = state.activeMatches[matchId]
    if (!match) throw new Error('Match not found')

    const walletStore = useWalletStore.getState()
    const userStore = useUserStore.getState()

    set(produce((state: GameStoreState) => {
      const matchToEnd = state.activeMatches[matchId]
      if (matchToEnd) {
        matchToEnd.status = 'completed'
        matchToEnd.winner = winner
        matchToEnd.endedAt = new Date()
        state.matchHistory[matchId] = matchToEnd
        delete state.activeMatches[matchId]
        delete state.gameStates[matchId]
      }
    }))

    await Promise.all([
      walletStore.processPayout(matchId, winner),
      userStore.updateStats(winner, { 
        won: true, 
        stake: match.stakeAmount 
      }),
      userStore.updateStats(winner === match.player1Id ? match.player2Id : match.player1Id, { 
        won: false, 
        stake: match.stakeAmount 
      })
    ])

    await saveString(STORAGE_KEY, JSON.stringify(get()))
  },

  forfeitMatch: async (matchId, forfeitingPlayerId) => {
    const match = get().activeMatches[matchId]
    if (!match) throw new Error('Match not found')

    const winnerId = match.player1Id === forfeitingPlayerId ? match.player2Id : match.player1Id
    await get().endMatch(matchId, winnerId)
  },

  joinMatch: async (matchId, playerId) => {
    const walletStore = useWalletStore.getState()
    const match = get().pendingMatches[matchId]
    
    if (!match) throw new Error('Match not found')
    
    const userWallet = walletStore.wallets[playerId]
    if (!userWallet || userWallet.balance < match.stakeAmount) {
      throw new Error('Insufficient funds')
    }

    set(produce((state: GameStoreState) => {
      delete state.pendingMatches[matchId]
      state.activeMatches[matchId] = {
        ...match,
        player2Id: playerId,
        status: 'active',
        startedAt: new Date()
      }
      state.playerReadyStatus[matchId] = new Set()
    }))

    await walletStore.placeBet(playerId, matchId, match.stakeAmount)
    await saveString(STORAGE_KEY, JSON.stringify(get()))
  },

  leaveMatch: async (matchId, playerId) => {
    set(produce((state: GameStoreState) => {
      delete state.activeMatches[matchId]
      delete state.gameStates[matchId]
      delete state.playerReadyStatus[matchId]
    }))
    await saveString(STORAGE_KEY, JSON.stringify(get()))
  },

  setPlayerReady: (matchId, playerId) => {
    set(produce((state: GameStoreState) => {
      if (!state.playerReadyStatus[matchId]) {
        state.playerReadyStatus[matchId] = new Set()
      }
      state.playerReadyStatus[matchId].add(playerId)
    }))
  },

  resetMatch: (matchId) => {
    set(produce((state: GameStoreState) => {
      if (state.gameStates[matchId]) {
        state.gameStates[matchId] = {
          ballPosition: { x: 0.5, y: 0.5 },
          player1Position: 0.5,
          player2Position: 0.5,
          scores: { player1: 0, player2: 0 },
          lastUpdate: Date.now(),
        }
      }
    }))
  },

  updateMatchSettings: (matchId, settings) => {
    set(produce((state: GameStoreState) => {
      state.matchSettings[matchId] = {
        ...(state.matchSettings[matchId] || {
          id: uuid.v4().toString(),
          matchId,
          maxScore: 11,
          ballSpeed: 1,
          paddleSize: 1,
          description: '',
        }),
        ...settings,
      }
    }))
    saveString(STORAGE_KEY, JSON.stringify(get()))
  },
}))

// Initialize store with persisted state
loadPersistedState().then((persistedState) => {
  useGameStore.setState({
    ...initialState,
    ...persistedState,
  })
})