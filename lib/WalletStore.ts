import { create } from "zustand"
import { produce } from 'immer'
import { saveString, loadString } from "@/app/utils/storage/storage"
import { useRootStore } from "@/app/models/RootStore"
import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { User, Match, Wallet, MatchSettings } from "@/app/types/global"
import uuid from 'react-native-uuid'

const STORAGE_KEY = 'pongou_wallet_store'
const PLATFORM_FEE_PERCENTAGE = 0.05

// Extended interfaces for internal use
interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'deposit' | 'withdrawal' | 'bet' | 'win'
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  matchId?: string
  description: string
}

interface EscrowHolding {
  matchId: string
  amount: number
  player1Id: string
  player2Id: string
  timestamp: number
}

export interface WalletStoreState {
  error: string | null
  wallets: Record<string, Wallet>
  isLoading: boolean
  pendingTransactions: Record<string, Transaction>
  escrowHoldings: Record<string, EscrowHolding>
  transactionHistory: Record<string, Transaction>
}

export interface WalletStoreActions {
  deposit: (userId: string, amount: number) => Promise<void>
  placeBet: (userId: string, matchId: string, amount: number) => Promise<void>
  withdraw: (userId: string, amount: number) => Promise<void>
  processPayout: (matchId: string, winnerId: string) => Promise<void>
  getWalletBalance: (userId: string) => number
  getLockedBalance: (userId: string) => number
  clearError: () => void
}

export type WalletStore = WalletStoreState & WalletStoreActions

const initialState: WalletStoreState = {
  error: null,
  wallets: {},
  isLoading: false,
  pendingTransactions: {},
  escrowHoldings: {},
  transactionHistory: {}
}

const loadPersistedState = async (): Promise<Partial<WalletStoreState>> => {
  const stored = await loadString(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  ...initialState,

  deposit: async (userId: string, amount: number) => {
    if (amount <= 0) {
      set(produce((state: WalletStoreState) => {
        state.error = 'Invalid deposit amount'
      }))
      return
    }

    set(produce((state: WalletStoreState) => {
      state.isLoading = true
      state.error = null
    }))

    try {
      const transactionId = uuid.v4() as string
      const transaction: Transaction = {
        id: transactionId,
        userId,
        amount,
        type: 'deposit',
        status: 'pending',
        timestamp: Date.now(),
        description: `Deposit of ${amount}`
      }

      set(produce((state: WalletStoreState) => {
        if (!state.wallets[userId]) {
          state.wallets[userId] = {
            id: uuid.v4() as string,
            userId,
            balance: 0,
            lockedBalance: 0,
            lastUpdated: new Date()
          }
        }

        state.pendingTransactions[transactionId] = transaction
        state.wallets[userId].balance += amount
        state.wallets[userId].lastUpdated = new Date()
        state.transactionHistory[transactionId] = { ...transaction, status: 'completed' }
      }))

      await saveString(STORAGE_KEY, JSON.stringify(get()))
    } catch (error) {
      set(produce((state: WalletStoreState) => {
        state.error = error instanceof Error ? error.message : 'Failed to process deposit'
      }))
    } finally {
      set(produce((state: WalletStoreState) => {
        state.isLoading = false
      }))
    }
  },

  placeBet: async (userId: string, matchId: string, amount: number) => {
    const wallet = get().wallets[userId]
    if (!wallet || wallet.balance - wallet.lockedBalance < amount) {
      set(produce((state: WalletStoreState) => {
        state.error = 'Insufficient funds'
      }))
      return
    }

    set(produce((state: WalletStoreState) => {
      state.isLoading = true
      state.error = null
    }))

    try {
      const transactionId = uuid.v4() as string
      const match = useGameStore.getState().activeMatches[matchId]
      
      if (!match) throw new Error('Match not found')

      const escrowHolding: EscrowHolding = {
        matchId,
        amount,
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        timestamp: Date.now()
      }

      set(produce((state: WalletStoreState) => {
        state.wallets[userId].lockedBalance += amount
        state.escrowHoldings[matchId] = escrowHolding
        state.transactionHistory[transactionId] = {
          id: transactionId,
          userId,
          amount,
          type: 'bet',
          status: 'completed',
          matchId,
          timestamp: Date.now(),
          description: `Bet placed on match ${matchId}`
        }
      }))

      await saveString(STORAGE_KEY, JSON.stringify(get()))
    } catch (error) {
      set(produce((state: WalletStoreState) => {
        state.error = error instanceof Error ? error.message : 'Failed to place bet'
      }))
    } finally {
      set(produce((state: WalletStoreState) => {
        state.isLoading = false
      }))
    }
  },

  withdraw: async (userId: string, amount: number) => {
    const wallet = get().wallets[userId]
    if (!wallet || wallet.balance - wallet.lockedBalance < amount) {
      set(produce((state: WalletStoreState) => {
        state.error = 'Insufficient available balance'
      }))
      return
    }

    set(produce((state: WalletStoreState) => {
      state.isLoading = true
      state.error = null
    }))

    try {
      const transactionId = uuid.v4() as string
      
      set(produce((state: WalletStoreState) => {
        state.wallets[userId].balance -= amount
        state.wallets[userId].lastUpdated = new Date()
        state.transactionHistory[transactionId] = {
          id: transactionId,
          userId,
          amount,
          type: 'withdrawal',
          status: 'completed',
          timestamp: Date.now(),
          description: `Withdrawal of ${amount}`
        }
      }))

      await saveString(STORAGE_KEY, JSON.stringify(get()))
    } catch (error) {
      set(produce((state: WalletStoreState) => {
        state.error = error instanceof Error ? error.message : 'Failed to process withdrawal'
      }))
    } finally {
      set(produce((state: WalletStoreState) => {
        state.isLoading = false
      }))
    }
  },

  processPayout: async (matchId: string, winnerId: string) => {
    const escrow = get().escrowHoldings[matchId]
    if (!escrow) {
      set(produce((state: WalletStoreState) => {
        state.error = 'No escrow found for this match'
      }))
      return
    }

    set(produce((state: WalletStoreState) => {
      state.isLoading = true
      state.error = null
    }))

    try {
      const totalPot = escrow.amount * 2
      const platformFee = totalPot * PLATFORM_FEE_PERCENTAGE
      const winningAmount = totalPot - platformFee
      const transactionId = uuid.v4() as string

      set(produce((state: WalletStoreState) => {
        // Release locked balances
        const loserId = escrow.player1Id === winnerId ? escrow.player2Id : escrow.player1Id
        state.wallets[winnerId].lockedBalance -= escrow.amount
        state.wallets[loserId].lockedBalance -= escrow.amount
        
        // Add winning amount to winner's balance
        state.wallets[winnerId].balance += winningAmount
        state.wallets[winnerId].lastUpdated = new Date()
        
        // Record transaction
        state.transactionHistory[transactionId] = {
          id: transactionId,
          userId: winnerId,
          amount: winningAmount,
          type: 'win',
          status: 'completed',
          matchId,
          timestamp: Date.now(),
          description: `Match ${matchId} winnings`
        }

        // Clear escrow
        delete state.escrowHoldings[matchId]
      }))

      await saveString(STORAGE_KEY, JSON.stringify(get()))
    } catch (error) {
      set(produce((state: WalletStoreState) => {
        state.error = error instanceof Error ? error.message : 'Failed to process payout'
      }))
    } finally {
      set(produce((state: WalletStoreState) => {
        state.isLoading = false
      }))
    }
  },

  getWalletBalance: (userId: string) => {
    const wallet = get().wallets[userId]
    return wallet ? wallet.balance : 0
  },

  getLockedBalance: (userId: string) => {
    const wallet = get().wallets[userId]
    return wallet ? wallet.lockedBalance : 0
  },

  clearError: () => {
    set(produce((state: WalletStoreState) => {
      state.error = null
    }))
  }
}))

// Initialize store with persisted state
loadPersistedState().then((persistedState) => {
  useWalletStore.setState({
    ...initialState,
    ...persistedState
  })
})