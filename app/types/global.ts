export interface User {
  id: string
  wins: number
  email: string
  losses: number
  username: string
  createdAt: Date
  lastActive: Date
  reputation: number
  totalMatches: number
}

export interface Match {
  id: string
  status: string
  winner: string
  endedAt: Date
  createdAt: Date
  player1Id: string
  player2Id: string
  startedAt: Date
  stakeAmount: number
  player1Score: number
  player2Score: number
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  lastUpdated: Date
  lockedBalance: number
}

export interface MatchSettings {
  id: string
  matchId: string
  maxScore: number
  ballSpeed: number
  paddleSize: number
  description: string
}