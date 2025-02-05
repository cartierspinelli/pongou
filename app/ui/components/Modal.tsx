import React from "react"
import { DimensionValue, Pressable, TouchableOpacity, ViewStyle } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
import { useTheme } from "@/app/ui/theme/useTheme"
import { X } from "lucide-react-native"
import { CustomFadeIn, CustomFadeOut } from "../animations/Animations"
import { Portal } from "@rn-primitives/portal"
import { cn } from "../lib/cn"
import { useScreen } from "./Screen"

type ModalProps<T extends { tapToClose?: boolean; closeButton?: boolean }> = {
  children?: React.ReactNode
  width?: DimensionValue
  height?: DimensionValue
  style?: ViewStyle
  className?: string
  containerStyle?: ViewStyle
  containerClassName?: string
  sidePadding?: boolean
  verticalPadding?: boolean
  visible: boolean
  tapToClose?: boolean
  closeButton?: boolean
  position?: "bottom" | "center"
  globalModal?: boolean
  onClose: () => void
}

export const Modal = ({
  children,
  width = "100%",
  height,
  style,
  className,
  containerStyle,
  containerClassName,
  visible,
  onClose,
  sidePadding = true,
  verticalPadding = true,
  closeButton = false,
  tapToClose = true,
  position = "center",
  globalModal = false,
}: ModalProps<{ tapToClose?: boolean; closeButton?: boolean }>) => {
  const { colors } = useTheme()
  const { screenId } = useScreen()

  const modalContent = (
    <Animated.View
      className={cn(
        "absolute w-full h-full z-[10000] flex-row",
        position === "center" && "justify-center items-center",
        position === "bottom" && "justify-center items-end",
        verticalPadding && "py-10",
        sidePadding && "px-5",
        containerClassName,
      )}
      style={containerStyle}
    >
      <Animated.View
        className="absolute top-0 w-screen h-screen bg-black/65"
        entering={CustomFadeIn(0.65)}
        exiting={CustomFadeOut(0.65)}
      >
        {tapToClose && onClose && <Pressable onPress={onClose} className="w-full h-full" />}
      </Animated.View>

      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        className={cn("bg-card z-[999] rounded-md", className)}
        style={[
          {
            width,
            height,
          },
          style,
        ]}
      >
        {closeButton && onClose && (
          <TouchableOpacity
            hitSlop={8}
            onPress={onClose}
            className="absolute top-2 right-2 z-[100]"
          >
            <X size={25} color={colors.baseContent} />
          </TouchableOpacity>
        )}
        {children}
      </Animated.View>
    </Animated.View>
  )

  return (
    visible &&
    (globalModal ? (
      modalContent
    ) : (
      <Portal name="modal" hostName={`screenModal-${screenId}`}>
        {modalContent}
      </Portal>
    ))
  )
}
