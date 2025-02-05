import React, { useEffect, useState } from "react"
import { View, Pressable } from "react-native"
import { AppStackScreenProps } from "@/app/navigators"
import {
  Text,
  Screen,
  Card,
  Button,
  ProgressIndicator,
  Badge,
  Separator,
  AdaptiveHeader,
} from "@/app/ui/components"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/app/ui/lib/cn"
import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
import { Match, User } from "@/app/types/global"
import { Feather } from "@expo/vector-icons"

interface LobbyScreenProps extends AppStackScreenProps<"Lobby"> {}

export const LobbyScreen = function LobbyScreen({
  navigation,
}: LobbyScreenProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  // Store access
  const { activeMatches, matchSettings } = useGameStore()
  const { currentUser, userStats, users, fetchLeaderboard } = useUserStore()
  const { wallets } = useWalletStore()

  // Local state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; rank: number; winRate: number }>>([])

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const leaderboardData = await fetchLeaderboard()
        setLeaderboard(leaderboardData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load lobby data")
        setIsLoading(false)
      }
    }
    loadData()
  }, [fetchLeaderboard])

  // Current user's wallet
  const userWallet = currentUser ? wallets[currentUser.id] : null
  const userStats = currentUser ? userStats[currentUser.id] : null

  const handleQuickJoin = async () => {
    // Implement quick join logic
    navigation.navigate("GameArena", { matchId: "new" })
  }

  const renderMatchCard = (match: Match) => {
    const player1 = users[match.player1Id]
    const settings = matchSettings[match.id]

    return (
      <Card key={match.id} className="mb-3 p-4 bg-card rounded-lg">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text variant="heading" className="text-base-content">
              {player1?.username}'s Game
            </Text>
            <Text variant="caption1" className="text-dim mt-1">
              Stake: ${match.stakeAmount}
            </Text>
          </View>
          <Button
            size="sm"
            variant="outline"
            className="px-4"
            onPress={() => navigation.navigate("GameArena", { matchId: match.id })}
          >
            Join
          </Button>
        </View>
        <View className="flex-row mt-2 space-x-2">
          <Badge variant="secondary" className="text-xs">
            {settings?.ballSpeed}x Speed
          </Badge>
          <Badge variant="outline" className="text-xs">
            {settings?.paddleSize} Paddle
          </Badge>
        </View>
      </Card>
    )
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-1 px-4"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16,
      }}
    >
      <AdaptiveHeader
        iosTitle="Lobby"
        rightView={() => (
          <Pressable onPress={() => navigation.navigate("Wallet")}>
            <Feather name="user" size={24} color={colors.baseContent} />
          </Pressable>
        )}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text variant="body" className="text-primary">
            Loading lobby...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-error">{error}</Text>
        </View>
      ) : (
        <View className="flex-1">
          {/* Stats Card */}
          <Card className="bg-primary p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text variant="heading" className="text-primary-content">
                  Welcome, {currentUser?.username}
                </Text>
                <Text variant="caption1" className="text-primary-content mt-1">
                  Balance: ${userWallet?.balance.toFixed(2)}
                </Text>
              </View>
              <View className="items-end">
                <Text variant="caption2" className="text-primary-content">
                  Win Rate
                </Text>
                <ProgressIndicator
                  value={userStats?.winRate ?? 0}
                  max={100}
                  className="w-20 mt-1"
                />
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View className="flex-row space-x-2 mb-4">
            <Button
              variant="secondary"
              className="flex-1"
              onPress={() => navigation.navigate("CreateMatch")}
            >
              Create Match
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onPress={handleQuickJoin}
            >
              Quick Join
            </Button>
          </View>

          {/* Available Matches */}
          <Text variant="title3" className="mb-2">
            Available Matches
          </Text>
          {Object.values(activeMatches).length > 0 ? (
            Object.values(activeMatches).map(renderMatchCard)
          ) : (
            <Text variant="body" className="text-dim text-center my-4">
              No matches available
            </Text>
          )}

          <Separator className="my-4" />

          {/* Top Players */}
          <Text variant="title3" className="mb-2">
            Top Players
          </Text>
          <Card className="bg-card rounded-lg p-4">
            {leaderboard.slice(0, 3).map((player, index) => (
              <View
                key={player.userId}
                className="flex-row items-center justify-between mb-2"
              >
                <View className="flex-row items-center">
                  <Text
                    variant="heading"
                    className={cn(
                      "w-8",
                      index === 0
                        ? "text-warning"
                        : index === 1
                        ? "text-base-300"
                        : "text-warning-content"
                    )}
                  >
                    #{index + 1}
                  </Text>
                  <Text variant="body">{users[player.userId]?.username}</Text>
                </View>
                <Text variant="caption1" className="text-dim">
                  {(player.winRate * 100).toFixed(0)}% WR
                </Text>
              </View>
            ))}
          </Card>
        </View>
      )}
    </Screen>
  )
}