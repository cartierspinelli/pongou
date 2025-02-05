/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps, useBottomHeightSafe } from "@/app/navigators"
import { Text, Button } from "@/app/ui/components/nativewindui"
import { Screen } from "@/app/ui/components/Screen"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
// To navigate to a screen, just do this: navigation.navigate("Home")
interface TemplateScreenProps extends AppStackScreenProps<"Template"> {}

export const TemplateScreen = observer(function TemplateScreen({
  navigation,
}: TemplateScreenProps) {
  // Theme and layout utilities
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const bottomTabBarHeight = useBottomHeightSafe()
  // Common state patterns
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stores and navigation (commented out by default)
  // const { someStore, anotherStore } = useStores()
  // const route = useRoute()

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
        paddingBottom: bottomTabBarHeight + insets.bottom,
      }}
    >
      {/* TODO: Add appropriate header: LargeTitleHeader or AdaptiveSearchHeader. (Use regular Header for really custom headers.) */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-error">{error}</Text>
          <Button variant="plain" onPress={() => setError(null)} className="mt-4">
            <Text>Try Again</Text>
          </Button>
        </View>
      ) : (
        // Main screen content goes here
        <>
          {/* <LargeTitleHeader title="Template" /> */}
          <Button onPress={() => navigation.navigate("Welcome")}>
            <Text>Go to Welcome</Text>
          </Button>
          <Button onPress={() => navigation.push("Template")}>
            <Text>Go to Template Deeper</Text>
          </Button>
          <View className="flex-1">
            <Text>Screen content for Template</Text>
          </View>
        </>
      )}
    </Screen>
  )
})
