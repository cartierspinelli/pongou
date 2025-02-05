import { VariantProps, cva } from "class-variance-authority"
import { cssInterop } from "nativewind"
import * as React from "react"
import { UITextView } from "react-native-uitextview"

import { cn } from "@/app/ui/lib/cn"

cssInterop(UITextView, { className: "style" })

const textVariants = cva("text-foreground font-poppins", {
  variants: {
    variant: {
      largeTitle: "text-4xl",
      title1: "text-3xl font-bold",
      title2: "text-[22px] leading-7",
      title3: "text-xl",
      heading: "text-[17px] leading-6 font-semibold",
      body: "text-[17px] leading-6",
      callout: "text-base",
      subhead: "text-[15px] leading-5",
      footnote: "text-[13px] leading-5",
      caption1: "text-xs",
      caption2: "text-[11px] leading-4",
    },
    color: {
      baseContent: "text-base-content",
      primary: "text-primary",
      secondary: "text-secondary-foreground/90",
      tertiary: "text-muted-foreground/90",
      quarternary: "text-muted-foreground/50",
      dim: "text-base-content/50",
      link: "text-primary/70",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "baseContent",
  },
})

const TextClassContext = React.createContext<
  | {
      variant?: VariantProps<typeof textVariants>["variant"]
      color?: VariantProps<typeof textVariants>["color"]
      className?: string
    }
  | undefined
>(undefined)

function Text({
  className,
  variant,
  color,
  customColor,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof UITextView> &
  VariantProps<typeof textVariants> & {
    customColor?: string
  }) {
  const parentContext = React.useContext(TextClassContext)

  // Use parent variant/color if not explicitly provided
  const finalVariant = variant ?? parentContext?.variant
  const finalColor = color ?? parentContext?.color
  const finalClassName = cn(parentContext?.className, className)

  return (
    <TextClassContext.Provider
      value={{
        variant: finalVariant,
        color: finalColor,
        className: finalClassName,
      }}
    >
      <UITextView
        className={cn(textVariants({ variant: finalVariant, color: finalColor }), finalClassName)}
        style={[customColor ? { color: customColor } : {}, style]}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export { Text, TextClassContext, textVariants }
