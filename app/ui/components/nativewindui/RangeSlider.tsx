import React, { useCallback } from "react"
import { View, ViewStyle } from "react-native"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { useTheme } from "@/app/ui/theme/useTheme"
import { cn } from "@/app/ui/lib/cn"

interface RangeSliderProps {
  values: [number, number]
  min: number
  max: number
  step?: number
  onValuesChange: (values: [number, number]) => void
  containerClassName?: string
  trackStyle?: ViewStyle
  selectedStyle?: ViewStyle
  unselectedStyle?: ViewStyle
  markerStyle?: ViewStyle
  pressedMarkerStyle?: ViewStyle
  containerStyle?: ViewStyle
  sliderLength?: number
}

export const RangeSlider = ({
  values,
  min,
  max,
  step = 1,
  onValuesChange,
  containerClassName,
  trackStyle,
  selectedStyle,
  unselectedStyle,
  markerStyle,
  pressedMarkerStyle,
  containerStyle,
  sliderLength = 280,
}: RangeSliderProps) => {
  const { colors } = useTheme()

  const handleValuesChange = useCallback(
    (values: number[]) => {
      onValuesChange([values[0], values[1]])
    },
    [onValuesChange],
  )

  return (
    <View className={cn("items-center py-2", containerClassName)}>
      <MultiSlider
        values={[values[0], values[1]]}
        min={min}
        max={max}
        step={step}
        onValuesChange={handleValuesChange}
        // sliderLength={280}
        selectedStyle={{
          backgroundColor: colors.primary,
          height: 4,
          ...selectedStyle,
        }}
        unselectedStyle={{
          backgroundColor: colors.border,
          height: 4,
          ...unselectedStyle,
        }}
        trackStyle={{
          height: 4,
          ...trackStyle,
        }}
        markerStyle={{
          backgroundColor: "white",
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          ...markerStyle,
        }}
        containerStyle={{
          height: 40,
          ...containerStyle,
        }}
        pressedMarkerStyle={{
          backgroundColor: "white",
          height: 24,
          width: 24,
          borderRadius: 12,
          ...pressedMarkerStyle,
        }}
        sliderLength={sliderLength}
      />
    </View>
  )
}
