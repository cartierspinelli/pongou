import { useHeaderHeight } from "@react-navigation/elements"
import { Portal } from "@rn-primitives/portal"
import { useNavigation } from "@react-navigation/native"
import * as React from "react"
import { View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

import type {
  AdaptiveSearchHeaderProps,
  NativeStackNavigationOptions,
  NativeStackNavigationSearchBarOptions,
} from "./types"

import { useTheme } from "@/app/ui/theme/useTheme"
import { Colors } from "@/app/ui/theme/colors"
import { useScreen } from "../../Screen"

export function AdaptiveSearchHeader(props: AdaptiveSearchHeaderProps) {
  const id = React.useId()
  const headerHeight = useHeaderHeight()
  const [isFocused, setIsFocused] = React.useState(false)
  const navigation = useNavigation()

  const { setHasLargeTitle } = useScreen()

  React.useEffect(() => {
    setHasLargeTitle(true)
  }, [setHasLargeTitle])

  const { colors, isDarkMode } = useTheme()

  const screenOptions = React.useMemo(() => {
    return propsToScreenOptions(
      { ...props, iosBlurEffect: "none" },
      colors,
      setIsFocused,
      isDarkMode,
    )
  }, [props, isDarkMode, colors])

  React.useEffect(() => {
    navigation.setOptions(screenOptions)
  }, [navigation, screenOptions])

  return (
    <View key={isDarkMode ? "dark" : "light"}>
      {props.searchBar?.content && isFocused && (
        <Portal name={`large-title:${id}`}>
          <Animated.View
            entering={FadeIn.delay(100)}
            style={{ top: headerHeight + 6 }}
            className="absolute bottom-0 left-0 right-0"
          >
            {props.searchBar?.content}
          </Animated.View>
        </Portal>
      )}
    </View>
  )
}

function propsToScreenOptions(
  props: AdaptiveSearchHeaderProps,
  colors: Colors,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  isDarkMode: boolean,
): NativeStackNavigationOptions {
  return {
    headerLargeTitle: props.iosIsLargeTitle,
    headerBackButtonMenuEnabled: props.iosBackButtonMenuEnabled,
    headerBackTitle: props.iosBackButtonTitle,
    headerBackTitleVisible: props.iosBackButtonTitleVisible,
    headerBackVisible: props.iosBackVisible,
    headerLargeTitleShadowVisible: props.shadowVisible,
    headerBlurEffect:
      props.iosBlurEffect === "none"
        ? undefined
        : (props.iosBlurEffect ??
          (isDarkMode ? "systemChromeMaterialDark" : "systemChromeMaterialLight")),
    headerShadowVisible: props.shadowVisible,
    headerLeft: props.leftView
      ? (headerProps) => (
          <View className="flex-row justify-center gap-4">{props.leftView!(headerProps)}</View>
        )
      : undefined,
    headerRight: props.rightView
      ? (headerProps) => (
          <View className="flex-row justify-center gap-4">{props.rightView!(headerProps)}</View>
        )
      : undefined,
    headerShown: props.shown,
    headerTitle: props.iosTitle,
    headerTransparent: props.iosBlurEffect !== "none",
    headerLargeStyle: {
      backgroundColor: props.backgroundColor ?? colors.background,
    },
    headerStyle:
      props.iosBlurEffect === "none"
        ? { backgroundColor: props.backgroundColor ?? colors.headerBackground }
        : undefined,
    headerTintColor: colors.baseContent,
    headerSearchBarOptions: props.searchBar
      ? {
          autoCapitalize: props.searchBar?.autoCapitalize,
          cancelButtonText: props.searchBar?.iosCancelButtonText,
          hideWhenScrolling: props.searchBar?.iosHideWhenScrolling ?? false,
          inputType: props.searchBar?.inputType,
          tintColor: props.searchBar?.iosTintColor ?? colors.primary,
          onBlur: () => {
            setIsFocused(false)
            props.searchBar?.onBlur?.()
          },
          onCancelButtonPress: props.searchBar?.onCancelButtonPress,
          onChangeText: props.searchBar?.onChangeText
            ? (event) => props.searchBar?.onChangeText!(event.nativeEvent.text)
            : undefined,
          onFocus: () => {
            setIsFocused(true)
            props.searchBar?.onFocus?.()
          },
          onSearchButtonPress: props.searchBar?.onSearchButtonPress,
          placeholder: props.searchBar?.placeholder ?? "Search...",
          ref: props.searchBar?.ref as NativeStackNavigationSearchBarOptions["ref"],
          textColor: props.searchBar?.textColor ?? colors.baseContent,
        }
      : undefined,
    ...props.screen,
  }
}
