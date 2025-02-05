import React, { useEffect, useRef, useState, useMemo } from "react"
import { View, Animated, PanResponder, Dimensions } from "react-native"
import { AppStackScreenProps } from "@/app/navigators"
import { Text, Screen, Card, Button, Modal } from "@/app/ui/components"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/app/ui/lib/cn"
import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
import { Match, MatchSettings } from "@/app/types/global"
import { Timer } from "lucide-react-native"

interface GameArenaScreenProps extends AppStackScreenProps<"GameArena"> {
  matchId: string
}

export const GameArenaScreen = function GameArenaScreen({
  navigation,
  route,
}: GameArenaScreenProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

  // Store access
  const { activeMatches, gameStates, matchSettings, updateGameState, endMatch } = useGameStore()
  const { users, userStats } = useUserStore()
  const { wallets } = useWalletStore()

  const matchId = route.params?.matchId
  const match = activeMatches[matchId]
  const settings = matchSettings[matchId]
  const gameState = gameStates[matchId]

  // Game state
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameTimer, setGameTimer] = useState(180) // 3 minutes
  const paddleAnimation = useRef(new Animated.Value(screenHeight / 2)).current

  // Memoized player data
  const playerData = useMemo(() => {
    if (!match) return { player1: null, player2: null }
    return {
      player1: {
        user: users[match.player1Id],
        stats: userStats[match.player1Id],
        wallet: wallets[match.player1Id],
      },
      player2: {
        user: users[match.player2Id],
        stats: userStats[match.player2Id],
        wallet: wallets[match.player2Id],
      },
    }
  }, [match, users, userStats, wallets])

  // Game controls
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = gestureState.moveY
      paddleAnimation.setValue(
        Math.max(
          50,
          Math.min(screenHeight - 50, newPosition),
        ),
      )
      updateGameState(matchId, {
        ...gameState,
        player1Position: newPosition,
      })
    },
  })

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          setIsGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Game over handler
  const handleGameOver = async () => {
    if (!match) return
    const winner = gameState.scores.player1 > gameState.scores.player2 
      ? match.player1Id 
      : match.player2Id
    await endMatch(matchId, winner)
    navigation.navigate("Lobby")
  }

  if (!match || !settings || !gameState) {
    return (
      <Screen
        safeAreaEdges={["top"]}
        className="bg-background"
        contentContainerClassName="flex-1 items-center justify-center"
      >
        <Text variant="title2" className="text-primary">Loading game...</Text>
      </Screen>
    )
  }

  return (
    <Screen
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-1"
    >
      {/* Game Header */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-base-200">
        <View className="flex-row items-center">
          <Timer className="w-4 h-4 text-primary mr-2" />
          <Text variant="title3" className="text-primary">
            {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
          </Text>
        </View>
        <Text variant="title3" className="text-primary">
          Stake: ${match.stakeAmount}
        </Text>
      </View>

      {/* Score Display */}
      <View className="flex-row justify-center items-center py-2 bg-base-100">
        <Card className="flex-row items-center px-6 py-2 rounded-lg bg-base-200">
          <Text variant="title1" className="text-primary mr-4">
            {gameState.scores.player1}
          </Text>
          <Text variant="title2" className="text-dim">
            vs
          </Text>
          <Text variant="title1" className="text-primary ml-4">
            {gameState.scores.player2}
          </Text>
        </Card>
      </View>

      {/* Game Canvas */}
      <View 
        className="flex-1 bg-base-100"
        {...panResponder.panHandlers}
      >
        {/* Left Paddle */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 20,
            transform: [{ translateY: paddleAnimation }],
            width: 10,
            height: settings.paddleSize,
            backgroundColor: colors.primary,
            borderRadius: 5,
          }}
        />

        {/* Right Paddle */}
        <View
          style={{
            position: 'absolute',
            right: 20,
            top: gameState.player2Position,
            width: 10,
            height: settings.paddleSize,
            backgroundColor: colors.primary,
            borderRadius: 5,
          }}
        />

        {/* Ball */}
        <View
          style={{
            position: 'absolute',
            left: gameState.ballPosition.x,
            top: gameState.ballPosition.y,
            width: 10,
            height: 10,
            backgroundColor: colors.primary,
            borderRadius: 5,
          }}
        />
      </View>

      {/* Player Info */}
      <View className="flex-row justify-between px-4 py-2 bg-base-200">
        <View>
          <Text variant="callout" className="text-primary">
            {playerData.player1?.user.username}
          </Text>
          <Text variant="caption1" className="text-dim">
            Win Rate: {playerData.player1?.stats.winRate}%
          </Text>
        </View>
        <View>
          <Text variant="callout" className="text-primary text-right">
            {playerData.player2?.user.username}
          </Text>
          <Text variant="caption1" className="text-dim text-right">
            Win Rate: {playerData.player2?.stats.winRate}%
          </Text>
        </View>
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={isGameOver}
        onClose={() => {}}
        className="bg-base-100 rounded-lg p-6 w-[80%]"
      >
        <Text variant="title1" className="text-primary text-center mb-4">
          Game Over!
        </Text>
        <Text variant="body" className="text-dim text-center mb-6">
          {gameState.scores.player1 > gameState.scores.player2 
            ? playerData.player1?.user.username 
            : playerData.player2?.user.username} wins!
        </Text>
        <Button
          variant="default"
          className="w-full"
          onPress={handleGameOver}
        >
          Return to Lobby
        </Button>
      </Modal>
    </Screen>
  )
}