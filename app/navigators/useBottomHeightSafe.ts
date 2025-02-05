import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs"
import { useContext } from "react"

export const useBottomHeightSafe = () => {
  const height = useContext(BottomTabBarHeightContext)

  if (height === undefined) {
    return 0
  }

  return height
}
