/* eslint-disable react-native/no-color-literals */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/app/ui/components/nativewindui"
import { useTheme } from "@/app/ui/theme/useTheme"
import { observer } from "mobx-react-lite"
import { BlurView } from "expo-blur"
import { spacing } from "@/app/ui/theme/spacing"
import * as LucideIcons from "lucide-react-native"

export const AnimatedTabBar = observer(
  ({ state: { index: activeIndex, routes }, navigation, descriptors }: BottomTabBarProps) => {
    const { colors, isDarkMode } = useTheme()
    const tabBarIcons = routes.map((route) => {
      const { options } = descriptors[route.key]
      return {
        name: options.title,
        icon: options.tabBarIcon,
        badge: options.tabBarBadge,
      }
    })

    const tabLineLeft = useSharedValue(0)

    const style = useAnimatedStyle(() => {
      return {
        left: `${tabLineLeft.value}%`,
      }
    })

    React.useEffect(() => {
      tabLineLeft.value = withTiming((activeIndex * 100) / tabBarIcons.length)
    }, [activeIndex, tabBarIcons.length, tabLineLeft])

    const insets = useSafeAreaInsets()

    return (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <BlurView
          style={{
            paddingBottom: insets.bottom,
            paddingTop: spacing.xs,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            flexDirection: "row",
            paddingHorizontal: spacing.md,
          }}
          intensity={50}
          tint={!isDarkMode ? "light" : "dark"}
        >
          {tabBarIcons.map((element, index) => {
            const activeElement = activeIndex === index
            return (
              <View
                key={element.name}
                style={{
                  width: `${(1 / tabBarIcons.length) * 100}%`,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(`${element.name}`)
                  }}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  {element.icon &&
                    element.icon({
                      focused: activeElement,
                      color: activeElement ? colors.inverse : `${colors.inverse}80`,
                      size: 20,
                    })}
                  <Text
                    style={{
                      color: activeElement ? colors.inverse : `${colors.inverse}80`,
                    }}
                    variant="caption1"
                    numberOfLines={1}
                  >
                    {element.name}
                  </Text>
                  {element.badge && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "red",
                        borderRadius: 5,
                        padding: 2,
                      }}
                    >
                      <Text variant="footnote" color="baseContent" className="text-white">
                        {element.badge.toString().toUpperCase()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )
          })}
        </BlurView>
      </Animated.View>
    )
  },
)
