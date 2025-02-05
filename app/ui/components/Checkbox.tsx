import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "./nativewindui/Text"
import { Check } from "lucide-react-native"
import { useTheme } from "../theme/useTheme"

interface CheckboxProps {
  label: string
  checked: boolean
  onValueChange: (checked: boolean) => void
  containerClassName?: string
  textClassName?: string
  checkboxPosition?: "left" | "right"
  renderLabel?: (isChecked: boolean) => React.ReactNode
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onValueChange,
  containerClassName = "",
  textClassName = "",
  checkboxPosition = "left",
  renderLabel,
}) => {
  const { colors } = useTheme()

  const renderCheckbox = () => (
    <View
      className={`h-5 w-5 rounded border-2 items-center justify-center mt-0.5 ${
        checked ? "border-primary bg-primary" : "border-gray-500"
      }`}
    >
      {checked && <Check size={14} color={colors.background} strokeWidth={3} />}
    </View>
  )

  return (
    <TouchableOpacity
      className={`flex flex-row items-start ${
        checkboxPosition === "right" ? "justify-between" : ""
      } ${containerClassName}`}
      onPress={() => onValueChange(!checked)}
    >
      {checkboxPosition === "left" && renderCheckbox()}
      <View className={`${checkboxPosition === "left" ? "ml-2" : "mr-2"} flex-1`}>
        {renderLabel ? renderLabel(checked) : <Text className={`${textClassName}`}>{label}</Text>}
      </View>
      {checkboxPosition === "right" && renderCheckbox()}
    </TouchableOpacity>
  )
}

export default Checkbox
