import * as Screens from "@/app/screens"
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AnimatedTabBar } from "./AnimatedTabBar"
import { HomeTabParamList, ScreenConfig, TabStackParamList } from "./types"
import { useTheme } from "@/app/ui/theme/useTheme"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useNavigation, StackActions } from "@react-navigation/native"
import { navigationRef } from "./navigationUtilities"
import screenConfig from "@/a0/config/screens.json"
import { Alert } from "react-native"
import * as LucideIcons from "lucide-react-native"

// Type for the JSON structure
interface ScreenConfigJSON {
  screens: {
    name: string
    componentName: string
    is_navbar: boolean
    icon?: {
      focused: string
      unfocused: string
    }
  }[]
}

// Ensure the imported JSON matches our type
const typedScreenConfig = screenConfig as ScreenConfigJSON

// Convert JSON config to ScreenConfig
const mapJsonToScreenConfig = (config: ScreenConfigJSON["screens"][0]): ScreenConfig | null => {
  if (!(config.componentName in Screens)) {

    return null
  }

  // Verify icon names exist in Lucide


  return {
    name: config.name,
    component: Screens[config.componentName as keyof typeof Screens],
    is_navbar: config.is_navbar,
    icon: config.icon ? {
      focused: config.icon.focused as keyof typeof LucideIcons,
      unfocused: config.icon.unfocused as keyof typeof LucideIcons,
    } : undefined,
  }
}

// Map all screens and filter based on conditions
export const screens: ScreenConfig[] = typedScreenConfig.screens
  .map(mapJsonToScreenConfig)
  .filter((screen): screen is ScreenConfig => {
    if (!screen) return false
    return true
  })

// Get navbar screens and non-navbar screens
const navbarScreens = screens.filter((screen) => screen.is_navbar)
const subScreens = screens.filter((screen) => !screen.is_navbar)

// Create a wrapper component for each stack
const TabStack = ({ screen }: { screen: ScreenConfig }) => {
  const Stack = createNativeStackNavigator<TabStackParamList>()
  const navigation = useNavigation()

  React.useEffect(() => {
    const navListener = navigationRef.current?.addListener("__unsafe_action__", (e) => {
      const action = e.data.action
      const currentOptions = navigationRef.current?.getCurrentOptions()
      // @ts-ignore
      const currentScreenName = currentOptions?.parentTab
      if (
        action.type === "NAVIGATE" &&
        // @ts-ignore
        action.payload?.name === currentScreenName
      ) {
        setTimeout(() => {
          // @ts-ignore
          if (navigationRef.current?.getCurrentOptions()?.parentTab) {
            navigationRef.current?.dispatch(StackActions.popToTop())
          }
        }, 10)
      } else if (
        action.type === "NAVIGATE" &&
        // @ts-ignore
        navbarScreens.find((s) => s.name === action.payload?.name)
      ) {
        const actionPayload: any = action.payload
        if (actionPayload?.params) {
          setTimeout(() => {
            console.log("Setting params", actionPayload?.params)
            navigationRef.current?.setParams(actionPayload?.params)
          }, 10)
        }
      }
    })

    return () => {
      navListener?.()
    }
  }, [screen.name, navigation])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={`${screen.name}Tab`} component={screen.component} />
      {subScreens.map((subScreen) => (
        <Stack.Screen
          key={`${screen.name}`}
          name={subScreen.name}
          component={subScreen.component}
          options={{
            // @ts-ignore
            parentTab: `${screen.name}`,
          }}
        />
      ))}
    </Stack.Navigator>
  )
}

// Move TabStack outside and memoize it
const MemoizedTabStack = React.memo(TabStack)

const Tab = createBottomTabNavigator<HomeTabParamList>()

// Update the helper function
const getIconComponent = (iconName: keyof typeof LucideIcons, props: { color: string, size: number }) => {
  if (!LucideIcons[iconName]) return null;
  const Icon = LucideIcons[iconName] as React.ComponentType<{ color: string, size: number }>
  return <Icon {...props} />
}

export const NavBar = () => {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: colors.baseContent,
        tabBarInactiveTintColor: colors.baseContent,
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      {navbarScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={`${screen.name}`}
          children={() => <MemoizedTabStack screen={screen} />}
          options={{
            tabBarIcon: ({ focused, color }) => {
              const iconName = focused ? screen.icon?.focused : screen.icon?.unfocused
              if (!iconName) return null
              return getIconComponent(iconName, { color, size: 25 })
            },
            title: screen.name,
          }}
        />
      ))}
    </Tab.Navigator>
  )
}
