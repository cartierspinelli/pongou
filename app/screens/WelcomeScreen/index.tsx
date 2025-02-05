import React from "react"
import { View, ScrollView, Dimensions, Linking } from "react-native"
import { AppStackScreenProps, useBottomHeightSafe } from "@/app/navigators"
import { Text, Button, LargeTitleHeader } from "@/app/ui/components"
import { Screen } from "@/app/ui/components/Screen"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "@/app/ui/components/Icon"

export const WelcomeScreen = ({ navigation }: AppStackScreenProps<"Welcome">) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const bottomHeight = useBottomHeightSafe()

  return (
    <Screen
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-col min-h-full"
      contentContainerStyle={{
        paddingBottom: bottomHeight + insets.bottom,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        {/* Header Section */}
        <LargeTitleHeader title="Welcome :)" />
        {/* Getting Started Section */}
        <View className="bg-card rounded-2xl p-6 mb-6">
          <Text variant="title2" className="mb-4">
            🚀 Getting Started
          </Text>

          <View className="space-y-4">
            <StepItem
              number="1"
              title="Customize Your Screens"
              description="Manage your app's screens in a0/config/screens.json"
              color={colors.primary}
            />

            <StepItem
              number="2"
              title="Remove This Screen"
              description='Delete "Welcome" from screens.json to remove this welcome screen'
              color={colors.secondary}
            />

            <StepItem
              number="3"
              title="Build Your App"
              description="Add your own screens /app/screens/ folder"
              color={colors.accent}
            />
          </View>
        </View>

        {/* Help Section */}
        <View className="bg-card rounded-2xl p-6 mb-6">
          <Text variant="title2" className="mb-4">
            💡 Need Help?
          </Text>

          <Text variant="body" className="text-base-content mb-4">
            Join our community for support:
          </Text>

          <Button
            onPress={() => {
              Linking.openURL("https://a0.dev/discord")
            }}
          >
            <Text>Join Discord</Text>
          </Button>
        </View>
      </ScrollView>
    </Screen>
  )
}

// Helper Components
const StepItem = ({ number, title, description, color }: { number: string; title: string; description: string; color: string }) => (
  <View className="flex-row items-start">
    <View
      style={{ backgroundColor: color }}
      className="w-8 h-8 rounded-full items-center justify-center mr-4"
    >
      <Text className="tfont-bold">{number}</Text>
    </View>
    <View className="flex-1">
      <Text variant="title3" className="mb-1">{title}</Text>
      <Text variant="body" className="text-base-content">{description}</Text>
    </View>
  </View>
)

