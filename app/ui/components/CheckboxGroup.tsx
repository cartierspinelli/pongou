import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "./nativewindui/Text"
import { Check } from "lucide-react-native"
import { useTheme } from "../theme/useTheme"

interface CheckboxOption {
  label: string
  value: string
  renderLabel?: (isSelected: boolean) => React.ReactNode
}

interface CheckboxGroupProps {
  options: CheckboxOption[]
  selectedValues: string[]
  onValueChange: (values: string[]) => void
  containerClassName?: string
  optionClassName?: string
  textClassName?: string
  checkboxPosition?: "left" | "right"
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onValueChange,
  containerClassName = "",
  optionClassName = "",
  textClassName = "",
  checkboxPosition = "left",
}) => {
  const { colors } = useTheme()

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter((v) => v !== value))
    } else {
      onValueChange([...selectedValues, value])
    }
  }

  const renderCheckbox = (isSelected: boolean) => (
    <View
      className={`h-5 w-5 rounded border-2 items-center justify-center mt-0.5 ${
        isSelected ? "border-primary bg-primary" : "border-gray-500"
      }`}
    >
      {isSelected && <Check size={14} color={colors.background} strokeWidth={3} />}
    </View>
  )

  return (
    <View className={`flex flex-col ${containerClassName}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value)

        return (
          <TouchableOpacity
            key={option.value}
            className={`flex flex-row items-start ${
              checkboxPosition === "right" ? "justify-between" : ""
            } my-2 ${optionClassName}`}
            onPress={() => toggleOption(option.value)}
          >
            {checkboxPosition === "left" && renderCheckbox(isSelected)}
            <View className={`${checkboxPosition === "left" ? "ml-2" : "mr-2"} flex-1`}>
              {option.renderLabel ? (
                option.renderLabel(isSelected)
              ) : (
                <Text className={`${textClassName}`}>{option.label}</Text>
              )}
            </View>
            {checkboxPosition === "right" && renderCheckbox(isSelected)}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default CheckboxGroup
