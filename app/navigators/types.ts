import { NativeStackScreenProps } from "@react-navigation/native-stack"
import * as LucideIcons from "lucide-react-native"
import { NavigatorScreenParams } from "@react-navigation/native"

// Define all possible screen names
export type AllScreenNames = (typeof import("./NavBar").screens)[number]["name"]

// Tab-level navigation params - only include Tab-suffixed names for the tab navigator
export type HomeTabParamList = {
  [K in AllScreenNames as `${K}`]: NavigatorScreenParams<TabStackParamList>
}

// Stack-level navigation params - only include regular names for the stack navigator
export type TabStackParamList = {
  [K in ScreenConfig["name"]]: any
} & {
  [K in ScreenConfig["name"] as `${K}Tab`]: any
}

export type ScreenConfig = {
  name: string
  component: React.ComponentType<any>
  is_navbar: boolean
  icon?: {
    focused: keyof typeof LucideIcons
    unfocused: keyof typeof LucideIcons
  }
  badge?: string
}

// Root stack params including both tab navigator and screens that can appear over tabs
export type AppStackParamList = {
  HomeNavigator: NavigatorScreenParams<HomeTabParamList>
} & TabStackParamList

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type HomeTabScreenProps<T extends keyof HomeTabParamList> = NativeStackScreenProps<
  HomeTabParamList,
  T
>
