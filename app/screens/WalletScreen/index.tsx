/* eslint-disable @typescript-eslint/no-unused-vars */
      import React, { useState } from "react"
      import { View } from "react-native"
      import { AppStackScreenProps } from "@/app/navigators"
      import { Text, Screen, AdaptiveHeader } from "@/app/ui/components"
      import { useTheme } from "@/app/ui/theme/useTheme"
      import { useSafeAreaInsets } from "react-native-safe-area-context"
      import { cn } from "@/app/ui/lib/cn"
      import { useGameStore } from "@/lib/GameStore"
import { useUserStore } from "@/lib/UserStore"
import { useWalletStore } from "@/lib/WalletStore"
      import { User, Match, Wallet, MatchSettings } from "@/app/types/global"
      
      interface WalletScreenProps extends AppStackScreenProps<"Wallet"> {}
      
      export const WalletScreen = function WalletScreen({
        navigation,
      }: WalletScreenProps) {
        // Theme and layout utilities
        const { colors } = useTheme()
        const insets = useSafeAreaInsets()
      
        // Common state patterns
        const [isLoading, setIsLoading] = useState(false)
        const [error, setError] = useState<string | null>(null)
      
        // Example error and loading handlers
        const handleError = (error: Error) => {
          setError(error.message)
          setIsLoading(false)
        }
      
        return (
          <Screen
            safeAreaEdges={["top"]}
            className="bg-background"
            contentContainerClassName="flex-col min-h-full px-sides"
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
          >
            {/* TODO: Add AdaptiveHeader */}
            {/* <AdaptiveHeader iosTitle="Screen Title"
                searchBar={{ placeholder: "Search...", onChangeText: (search: string) => {console.log("search", search)} }} /> */}
            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <Text
                  variant="body" // or "largeTitle" | "title1" | "title2" | "title3" | "heading" | "body" | "callout" | "subhead" | "footnote" | "caption1" | "caption2"
                  className="text-primary"
                >
                  Loading...
                </Text>
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-error">{error}</Text>
              </View>
            ) : (
              // Main screen content goes here
              <View className="flex-1">
                <Text>Screen content for Wallet</Text>
              </View>
            )}
          </Screen>
        )
      }