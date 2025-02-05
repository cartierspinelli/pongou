import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { AppStackScreenProps } from "@/app/navigators"
import {
  Text,
  Screen,
  AdaptiveHeader,
  Card,
  Slider,
  Input,
  TextArea,
  Button,
  ProgressIndicator,
} from "@/app/ui/components"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/app/ui/lib/cn"
import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
import { Match, MatchSettings } from "@/app/types/global"

interface CreateMatchScreenProps extends AppStackScreenProps<"CreateMatch"> {}

export const CreateMatchScreen = function CreateMatchScreen({
  navigation,
}: CreateMatchScreenProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  // Store hooks
  const { createMatch } = useGameStore()
  const { currentUser } = useUserStore()
  const { wallets, placeBet } = useWalletStore()

  // Local state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    stakeAmount: 0,
    maxScore: 11,
    ballSpeed: 50,
    paddleSize: 50,
    description: "",
  })

  // Derived state
  const currentWallet = currentUser ? wallets[currentUser.id] : null
  const canCreateMatch = settings.stakeAmount > 0 && 
    currentWallet && 
    currentWallet.balance >= settings.stakeAmount

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completed = 0
    if (settings.stakeAmount > 0) completed += 25
    if (settings.description.length > 0) completed += 25
    if (settings.ballSpeed !== 50) completed += 25
    if (settings.paddleSize !== 50) completed += 25
    return completed
  }

  const handleCreateMatch = async () => {
    if (!currentUser || !canCreateMatch) return

    setIsLoading(true)
    try {
      const matchData: Omit<Match, "id"> = {
        status: "waiting",
        winner: "",
        endedAt: new Date(),
        createdAt: new Date(),
        player1Id: currentUser.id,
        player2Id: "",
        startedAt: new Date(),
        stakeAmount: settings.stakeAmount,
        player1Score: 0,
        player2Score: 0,
      }

      const matchId = await createMatch(matchData)
      await placeBet(currentUser.id, matchId, settings.stakeAmount)
      
      navigation.navigate("Lobby")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create match")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-1 px-4"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
      }}
    >
      <AdaptiveHeader iosTitle="Create Match" />

      <ProgressIndicator 
        value={getCompletionPercentage()} 
        className="mb-6 mx-4" 
      />

      <Card className="mb-4 p-4 rounded-lg bg-base-200">
        <Text variant="title3" className="mb-4">Stake Settings</Text>
        <View className="flex-row items-center justify-between mb-2">
          <Text variant="body" className="text-base-content">
            Your Balance:
          </Text>
          <Text variant="heading" className="text-primary">
            ${currentWallet?.balance.toFixed(2) || '0.00'}
          </Text>
        </View>
        <Input
          placeholder="Enter stake amount"
          keyboardType="numeric"
          value={settings.stakeAmount.toString()}
          onChangeText={(value) => 
            setSettings(prev => ({ ...prev, stakeAmount: parseFloat(value) || 0 }))
          }
          className="mb-2"
        />
      </Card>

      <Card className="mb-4 p-4 rounded-lg bg-base-200">
        <Text variant="title3" className="mb-4">Game Settings</Text>
        
        <Text variant="body" className="mb-2">Ball Speed</Text>
        <Slider
          value={settings.ballSpeed}
          minimumValue={30}
          maximumValue={100}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, ballSpeed: value }))
          }
          className="mb-4"
        />

        <Text variant="body" className="mb-2">Paddle Size</Text>
        <Slider
          value={settings.paddleSize}
          minimumValue={30}
          maximumValue={70}
          onValueChange={(value) => 
            setSettings(prev => ({ ...prev, paddleSize: value }))
          }
          className="mb-4"
        />
      </Card>

      <Card className="mb-6 p-4 rounded-lg bg-base-200">
        <Text variant="title3" className="mb-4">Match Description</Text>
        <TextArea
          placeholder="Add match description or requirements..."
          value={settings.description}
          onChangeText={(value) => 
            setSettings(prev => ({ ...prev, description: value }))
          }
          className="h-24"
        />
      </Card>

      {error && (
        <Text className="text-error text-center mb-4">{error}</Text>
      )}

      <View className="mt-auto">
        <Button
          variant={canCreateMatch ? "default" : "secondary"}
          onPress={handleCreateMatch}
          disabled={!canCreateMatch || isLoading}
          className="w-full py-4"
        >
          <Text className="text-primary-content">
            {isLoading 
              ? "Creating Match..." 
              : canCreateMatch 
                ? "Create Match" 
                : "Insufficient Balance"
            }
          </Text>
        </Button>
      </View>
    </Screen>
  )
}