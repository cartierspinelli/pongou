import React, { FC, useState } from "react"
import { View, Dimensions } from "react-native"
import { AppStackScreenProps, useBottomHeightSafe } from "@/app/navigators"
import { Text, Button } from "@/app/ui/components/nativewindui"
import { Screen } from "@/app/ui/components/Screen"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@/app/ui/components/Icon"
import { BarChart } from "react-native-chart-kit"

const WelcomeScreen = ({ navigation }: AppStackScreenProps<"Welcome">) => {
  // Theme and layout utilities
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const bottomHeight = useBottomHeightSafe()

  // Common state patterns
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Example error and loading handlers
  const handleError = (error: Error) => {
    setError(error.message)
    setIsLoading(false)
  }

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  }

  return (
    <Screen
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-col min-h-full"
      contentContainerStyle={{
        paddingBottom: bottomHeight + insets.bottom,
      }}
    >
      <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} className="absolute inset-0" />

      <View className="flex-1 items-center justify-center px-sides">
        <Text variant="largeTitle" className="text-center mb-4">
          Welcome to a0.dev
        </Text>
        <Text className="text-center mb-8">This is a template screen and will be replaced.</Text>
      </View>
    </Screen>
  )
}

export default WelcomeScreen
