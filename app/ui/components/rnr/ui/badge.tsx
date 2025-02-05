import * as Slot from "@rn-primitives/slot"
import type { SlottableViewProps } from "@rn-primitives/types"
import { cva, type VariantProps } from "class-variance-authority"
import { View } from "react-native"
import { cn } from "@/app/ui/lib/cn"
import { TextClassContext } from "@/app/ui/components/rnr/ui/text"
import { Text } from "../../nativewindui"

const badgeVariants = cva(
  "web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary web:hover:opacity-80 active:opacity-80",
        secondary: "border-transparent bg-secondary web:hover:opacity-80 active:opacity-80",
        destructive: "border-transparent bg-destructive web:hover:opacity-80 active:opacity-80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const badgeTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type BadgeProps = SlottableViewProps &
  VariantProps<typeof badgeVariants> & { children: React.ReactNode }

function Badge({ className, variant, asChild, children, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View
  const content = typeof children === "string" ? <Text>{children}</Text> : children
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props}>
        {content}
      </Component>
    </TextClassContext.Provider>
  )
}

export { Badge, badgeTextVariants, badgeVariants }
export type { BadgeProps }
