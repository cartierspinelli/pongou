/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/display-name */
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import * as React from "react"

import { useTheme } from "@/app/ui/theme/useTheme"
import { cn } from "../../lib/cn"

type SheetProps = React.ComponentPropsWithoutRef<typeof BottomSheetModal> & {
  viewProps?: React.ComponentPropsWithoutRef<typeof BottomSheetView>
  className?: string
}

const Sheet = React.forwardRef<BottomSheetModal, SheetProps>(
  (
    {
      index = 0,
      backgroundStyle,
      style,
      handleIndicatorStyle,
      children,
      className,
      viewProps,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme()

    const renderBackdrop = React.useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      ),
      [],
    )
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        backgroundStyle={
          backgroundStyle ?? {
            backgroundColor: colors.card,
          }
        }
        style={
          style ?? {
            borderWidth: 1,
            borderColor: `${colors.border}99`,
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
          }
        }
        handleIndicatorStyle={
          handleIndicatorStyle ?? {
            backgroundColor: colors.border,
          }
        }
        backdropComponent={renderBackdrop}
        {...props}
      >
        <BottomSheetView className={cn("flex-1 pb-10", className)} {...viewProps}>
          <>{children}</>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

function useSheetRef() {
  return React.useRef<BottomSheetModal>(null)
}

export { Sheet as BottomSheetModal, useSheetRef }
