import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import "./globals.css"
SplashScreen.preventAutoHideAsync()

function A0App() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default A0App
