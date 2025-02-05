import React, { ErrorInfo } from "react"
import { Appearance, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "@/app/ui/components/nativewindui"

import { useTheme } from "@/app/ui/theme/useTheme"
import { Screen } from "@/app/ui/components/Screen"
import { Icon } from "@/app/ui/components/Icon"
import { spacing } from "@/app/ui/theme/spacing"
import { colors } from "@/app/ui/theme/colors"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <Icon icon="star" size={64} />
        <Text variant="heading">Error</Text>
        <Text variant="caption1">An error occurred</Text>
      </View>

      <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
        <Text variant="body">{`${props.error}`.trim()}</Text>
        <Text selectable style={$errorBacktrace}>
          {`${props.errorInfo?.componentStack ?? ""}`.trim()}
        </Text>
      </ScrollView>

      <Button variant="primary" style={$resetButton} onPress={props.onReset} />
    </Screen>
  )
}

const $contentContainer: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  flex: 1,
}

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: "center",
}

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.baseContent,
  marginVertical: spacing.md,
  borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.md,
}

const $errorBacktrace: TextStyle = {
  marginTop: spacing.md,
  color: colors.dim,
}

const $resetButton: ViewStyle = {
  backgroundColor: colors.error,
  paddingHorizontal: spacing.xxl,
}
