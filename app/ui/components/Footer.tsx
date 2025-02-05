import React from "react"
import { View, ViewStyle } from "react-native"
import { Portal } from "@rn-primitives/portal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "../lib/cn"
import { useScreen } from "./Screen"
import { useBottomHeightSafe } from "@/app/navigators"
import { spacing } from "@/app/ui/theme/spacing"

interface FooterProps {
  children: React.ReactNode
  className?: string
  style?: ViewStyle
}

export const Footer = ({ children, className, style }: FooterProps) => {
  const insets = useSafeAreaInsets()
  const bottomHeight = useBottomHeightSafe()
  const { screenId } = useScreen()

  return (
    <Portal name="footer" hostName={`screenFooter-${screenId}`}>
      <View
        className={cn("absolute bottom-0 z-50 w-full", className)}
        style={[
          {
            paddingBottom: bottomHeight + spacing.xxs,
          },
          style,
        ]}
      >
        {children}
      </View>
    </Portal>
  )
}
