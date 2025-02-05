import React, { useEffect, useState, useCallback } from "react"
import { View, FlatList, Pressable, Dimensions } from "react-native"
import { AppStackScreenProps } from "@/app/navigators"
import {
  Text,
  Screen,
  AdaptiveHeader,
  Card,
  CardContent,
  Badge,
  ProgressIndicator,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/ui/components"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/app/ui/lib/cn"
import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
import { Match, User } from "@/app/types/global"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface LiveMatchesScreenProps extends AppStackScreenProps<"LiveMatches"> {}

export const LiveMatchesScreen = function LiveMatchesScreen({
  navigation,
}: LiveMatchesScreenProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  // Store data
  const { activeMatches, gameStates, matchSettings } = useGameStore()
  const { users, userStats } = useUserStore()
  const { wallets } = useWalletStore()

  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  // Transform matches for display
  const liveMatches = Object.entries(activeMatches).map(([id, match]) => ({
    ...match,
    id,
    gameState: gameStates[id],
    settings: matchSettings[id],
    player1: users[match.player1Id],
    player2: users[match.player2Id],
  }))

  const renderMatchCard = useCallback(
    ({ item: match }: { item: Match & { gameState?: any; settings?: any; player1: User; player2: User } }) => {
      const isSelected = selectedMatch === match.id
      const gameState = gameStates[match.id] || {
        scores: { player1: 0, player2: 0 },
        ballPosition: { x: 50, y: 50 },
      }

      return (
        <Pressable
          onPress={() => {
            setSelectedMatch(match.id)
            navigation.navigate("GameArena", { matchId: match.id, isSpectating: true })
          }}
        >
          <Card
            className={cn(
              "mb-4 overflow-hidden",
              "border border-primary/10 rounded-lg",
              isSelected && "border-primary",
            )}
          >
            <CardContent className="p-4">
              {/* Match Header */}
              <View className="flex-row items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 px-2 py-1 rounded-full"
                >
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                    <Text className="text-xs">LIVE</Text>
                  </View>
                </Badge>
                <Text className="text-base-content/60 text-sm">
                  Stake: ${match.stakeAmount}
                </Text>
              </View>

              {/* Players Section */}
              <View className="flex-row justify-between items-center mb-4">
                {/* Player 1 */}
                <View className="flex-1 items-center">
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage
                      source={{ uri: `https://placehold.co/100x100/primary/light` }}
                    />
                    <AvatarFallback>
                      {match.player1?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Text className="text-sm font-medium mb-1">
                    {match.player1?.username || "Player 1"}
                  </Text>
                  <Text className="text-xs text-base-content/60">
                    Win Rate:{" "}
                    {userStats[match.player1Id]?.winRate
                      ? `${(userStats[match.player1Id].winRate * 100).toFixed(1)}%`
                      : "N/A"}
                  </Text>
                </View>

                {/* Score */}
                <View className="flex-row items-center mx-4">
                  <Text className="text-2xl font-bold">
                    {gameState.scores.player1}
                  </Text>
                  <Text className="text-xl font-bold mx-2">-</Text>
                  <Text className="text-2xl font-bold">
                    {gameState.scores.player2}
                  </Text>
                </View>

                {/* Player 2 */}
                <View className="flex-1 items-center">
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage
                      source={{ uri: `https://placehold.co/100x100/primary/light` }}
                    />
                    <AvatarFallback>
                      {match.player2?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Text className="text-sm font-medium mb-1">
                    {match.player2?.username || "Player 2"}
                  </Text>
                  <Text className="text-xs text-base-content/60">
                    Win Rate:{" "}
                    {userStats[match.player2Id]?.winRate
                      ? `${(userStats[match.player2Id].winRate * 100).toFixed(1)}%`
                      : "N/A"}
                  </Text>
                </View>
              </View>

              {/* Match Info */}
              <View className="bg-base-200 p-3 rounded-lg">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="speedometer"
                      size={16}
                      color={colors.baseContent}
                    />
                    <Text className="text-xs ml-1">
                      Speed: {match.settings?.ballSpeed || "Normal"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={colors.baseContent}
                    />
                    <Text className="text-xs ml-1">
                      {new Date(match.startedAt).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={16}
                      color={colors.baseContent}
                    />
                    <Text className="text-xs ml-1">Spectate</Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>
      )
    },
    [selectedMatch, gameStates, colors.baseContent, navigation],
  )

  return (
    <Screen
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-1 px-4"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
    >
      <AdaptiveHeader
        iosTitle="Live Matches"
        searchBar={{
          placeholder: "Search matches...",
          onChangeText: (text: string) => console.log("search", text),
        }}
      />

      {liveMatches.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons
            name="gamepad-variant-outline"
            size={48}
            color={colors.baseContent}
            style={{ opacity: 0.5 }}
          />
          <Text className="text-base-content/60 mt-4">
            No live matches at the moment
          </Text>
        </View>
      ) : (
        <FlatList
          data={liveMatches}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </Screen>
  )
}