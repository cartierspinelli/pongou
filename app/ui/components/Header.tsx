import React from "react"
import { View, ViewStyle } from "react-native"
import { Portal } from "@rn-primitives/portal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "../lib/cn"
import { useScreen } from "./Screen"

interface FooterProps {
  children: React.ReactNode
  className?: string
  style?: ViewStyle
}

export const Header = ({ children, className, style }: FooterProps) => {
  const insets = useSafeAreaInsets()
  const { screenId } = useScreen()

  return (
    <Portal name="header" hostName={`screenHeader-${screenId}`}>
      <View className={cn(className)} style={style}>
        {children}
      </View>
    </Portal>
  )
}
