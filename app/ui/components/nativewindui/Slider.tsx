import RNSlider from "@react-native-community/slider"
import { Platform } from "react-native"

import { useTheme } from "@/app/ui/theme/useTheme"
import { COLORS } from "@/app/ui/theme/colors"

function Slider({
  thumbTintColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNSlider>) {
  const { colors } = useTheme()
  return (
    <RNSlider
      thumbTintColor={(thumbTintColor ?? Platform.OS === "ios") ? COLORS.white : colors.primary}
      minimumTrackTintColor={minimumTrackTintColor ?? colors.primary}
      maximumTrackTintColor={
        (maximumTrackTintColor ?? Platform.OS === "android") ? colors.primary : undefined
      }
      {...props}
    />
  )
}

export { Slider }
