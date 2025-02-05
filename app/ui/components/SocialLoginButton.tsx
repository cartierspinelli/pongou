import React from "react"
import { View, useColorScheme } from "react-native"
import { Button } from "./nativewindui"
import { Text } from "./nativewindui"
import { Icon } from "./Icon"
import { Mail } from "lucide-react-native"
import { cn } from "@/app/ui/lib/cn"
import { useTheme } from "../theme/useTheme"

type SocialButtonType = "apple" | "google" | "email" | "facebook"

type IconConfig = {
  light: string | React.ComponentType<any>
  dark?: string | React.ComponentType<any>
  darkTint?: string
}

type SocialLoginButtonProps = {
  type: SocialButtonType
  label?: string
  onPress?: () => void
  className?: string
}

const defaultIcons: Record<SocialButtonType, IconConfig> = {
  apple: {
    light: "apple_logo_black",
    dark: "apple_logo_white",
  },
  google: {
    light: "google_logo",
  },
  facebook: {
    light: "facebook_logo",
  },
  email: {
    light: Mail,
    darkTint: "white",
  },
}

const defaultLabels: Record<SocialButtonType, string> = {
  apple: "Continue with Apple",
  google: "Continue with Google",
  facebook: "Continue with Facebook",
  email: "Continue with Email",
}

export const SocialLoginButton = ({
  type,
  label,
  onPress,
  className = "",
}: SocialLoginButtonProps) => {
  const { isDarkMode } = useTheme()

  const iconConfig = defaultIcons[type]
  const resolvedIcon = isDarkMode && iconConfig.dark ? iconConfig.dark : iconConfig.light
  const resolvedLabel = label ?? defaultLabels[type]
  const iconColor = isDarkMode ? iconConfig.darkTint : undefined

  return (
    <Button
      onPress={onPress}
      variant={"outline"}
      className={cn(
        "mb-2 rounded-lg border border-border flex-row items-center justify-between py-3 px-4",
        className,
      )}
    >
      {typeof resolvedIcon === "string" ? (
        <Icon icon={resolvedIcon as any} size={24} />
      ) : (
        (() => {
          const IconComponent = resolvedIcon as React.ComponentType<any>
          return <IconComponent color={iconColor || "black"} size={24} />
        })()
      )}
      <Text className="text-base-content font-bold">{resolvedLabel}</Text>
      <View className="w-[24px]" />
    </Button>
  )
}
