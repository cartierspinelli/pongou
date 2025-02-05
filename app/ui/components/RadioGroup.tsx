import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "./nativewindui/Text"

interface RadioOption {
  label: string
  value: string
  renderLabel?: () => React.ReactNode
}

interface RadioGroupProps {
  options: RadioOption[]
  selectedValue: string
  onValueChange: (value: string) => void
  containerClassName?: string
  optionClassName?: string
  textClassName?: string
  radioPosition?: "left" | "right"
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
  containerClassName = "",
  optionClassName = "",
  textClassName = "",
  radioPosition = "left",
}) => {
  const renderRadio = (isSelected: boolean) => (
    <View
      className={`h-5 w-5 rounded-full border-2 items-center justify-center ${
        isSelected ? "border-primary" : "border-gray-500"
      }`}
    >
      {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </View>
  )

  return (
    <View className={`flex flex-col ${containerClassName}`}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          className={`flex flex-row items-center ${
            radioPosition === "right" ? "justify-between" : ""
          } my-2 ${optionClassName}`}
          onPress={() => onValueChange(option.value)}
        >
          {radioPosition === "left" && renderRadio(selectedValue === option.value)}
          {option.renderLabel ? (
            option.renderLabel()
          ) : (
            <Text className={`${radioPosition === "left" ? "ml-2" : "mr-2"} ${textClassName}`}>
              {option.label}
            </Text>
          )}
          {radioPosition === "right" && renderRadio(selectedValue === option.value)}
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default RadioGroup
