import {
  FlashList,
  type FlashListProps,
  type ListRenderItem as FlashListRenderItem,
  type ListRenderItemInfo,
} from "@shopify/flash-list"
import { cva } from "class-variance-authority"
import { cssInterop } from "nativewind"
import * as React from "react"
import {
  Platform,
  PressableProps,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text, TextClassContext } from "./Text"
import { Button } from "./Button"
import { cn } from "../../lib/cn"

cssInterop(FlashList, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
})

type ListDataItem = any
type ListVariant = "insets" | "full-width"

type ListRef<T extends ListDataItem> = React.Ref<FlashList<T>>

type ListRenderItemProps<T extends ListDataItem> = ListRenderItemInfo<T> & {
  variant?: ListVariant
  isFirstInSection?: boolean
  isLastInSection?: boolean
  sectionHeaderAsGap?: boolean
}

type ListProps<T extends ListDataItem> = Omit<FlashListProps<T>, "renderItem"> & {
  renderItem?: ListRenderItem<T>
  variant?: ListVariant
  sectionHeaderAsGap?: boolean
  rootClassName?: string
  rootStyle?: StyleProp<ViewStyle>
}
type ListRenderItem<T extends ListDataItem> = (
  props: ListRenderItemProps<T>,
) => ReturnType<FlashListRenderItem<T>>

const rootVariants = cva("min-h-2 flex-1", {
  variants: {
    variant: {
      insets: "",
      "full-width": "bg-card dark:bg-background rounded-lg overflow-hidden",
    },
    sectionHeaderAsGap: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "full-width",
      sectionHeaderAsGap: true,
      className: "bg-card dark:bg-background",
    },
  ],
  defaultVariants: {
    variant: "full-width",
    sectionHeaderAsGap: false,
  },
})

function ListComponent<T extends ListDataItem>(
  {
    variant = "full-width",
    rootClassName,
    rootStyle,
    contentContainerClassName,
    renderItem,
    data,
    sectionHeaderAsGap = false,
    contentInsetAdjustmentBehavior = "automatic",
    ...props
  }: ListProps<T>,
  ref: ListRef<T>,
) {
  const insets = useSafeAreaInsets()
  return (
    <View
      className={cn(
        rootVariants({
          variant,
          sectionHeaderAsGap,
        }),
        rootClassName,
      )}
      style={rootStyle}
    >
      <FlashList
        data={data}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        renderItem={renderItemWithVariant(renderItem, variant, data, sectionHeaderAsGap)}
        contentContainerClassName={cn(
          variant === "insets" && (!data || (typeof data?.[0] !== "string" && "pt-4")),
          contentContainerClassName,
        )}
        contentContainerStyle={{
          paddingBottom:
            !contentInsetAdjustmentBehavior || contentInsetAdjustmentBehavior === "never"
              ? insets.bottom + 16
              : insets.bottom,
        }}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        {...props}
        ref={ref}
      />
    </View>
  )
}

function getItemType<T>(item: T) {
  return typeof item === "string" ? "sectionHeader" : "row"
}

function renderItemWithVariant<T extends ListDataItem>(
  renderItem: ListRenderItem<T> | null | undefined,
  variant: ListVariant,
  data: readonly T[] | null | undefined,
  sectionHeaderAsGap?: boolean,
) {
  return (args: ListRenderItemProps<T>) => {
    const previousItem = data?.[args.index - 1]
    const nextItem = data?.[args.index + 1]
    return renderItem
      ? renderItem({
          ...args,
          variant,
          isFirstInSection: !previousItem || typeof previousItem === "string",
          isLastInSection: !nextItem || typeof nextItem === "string",
          sectionHeaderAsGap,
        })
      : null
  }
}

const List = React.forwardRef(ListComponent) as <T extends ListDataItem>(
  props: ListProps<T> & { ref?: ListRef<T> },
) => React.ReactElement

function isPressable(props: PressableProps) {
  return (
    ("onPress" in props && props.onPress) ||
    ("onLongPress" in props && props.onLongPress) ||
    ("onPressIn" in props && props.onPressIn) ||
    ("onPressOut" in props && props.onPressOut) ||
    ("onLongPress" in props && props.onLongPress)
  )
}

type ListItemProps<T = any> = PressableProps &
  ListRenderItemProps<T> & {
    title?: string
    subTitle?: string
    androidRootClassName?: string
    titleClassName?: string
    titleStyle?: StyleProp<TextStyle>
    textNumberOfLines?: number
    subTitleClassName?: string
    subTitleStyle?: StyleProp<TextStyle>
    subTitleNumberOfLines?: number
    textContentClassName?: string
    leftView?: React.ReactNode
    rightView?: React.ReactNode
    removeSeparator?: boolean
  }
type ListItemRef = React.Ref<View>

const itemVariants = cva("gap-0 flex-row gap-0 bg-card", {
  variants: {
    variant: {
      insets: "bg-card bg-card/70",
      "full-width": "bg-card dark:bg-background",
    },
    sectionHeaderAsGap: {
      true: "",
      false: "",
    },
    isFirstItem: {
      true: "",
      false: "",
    },
    isFirstInSection: {
      true: "",
      false: "",
    },
    removeSeparator: {
      true: "",
      false: "",
    },
    isLastInSection: {
      true: "",
      false: "",
    },
    disabled: {
      true: "opacity-70",
      false: "opacity-100",
    },
  },
  compoundVariants: [
    {
      variant: "insets",
      sectionHeaderAsGap: true,
      className: "dark:bg-card dark:bg-card/70",
    },
    {
      variant: "insets",
      isFirstInSection: true,
      className: "rounded-t-[10px]",
    },
    {
      variant: "insets",
      isLastInSection: true,
      className: "rounded-b-[10px]",
    },
    {
      removeSeparator: false,
      isLastInSection: true,
      className: "border-b-0 border-b border-border/25 dark:border-border/80",
    },
    {
      variant: "insets",
      isFirstItem: true,
      className: "border-border/40 border-t",
    },
  ],
  defaultVariants: {
    variant: "insets",
    sectionHeaderAsGap: false,
    isFirstInSection: false,
    isLastInSection: false,
    disabled: false,
  },
})

// Add this interface near the top with other type definitions
interface ListItemData {
  title?: string
  subTitle?: string
}

function ListItemComponent<T>(
  {
    item,
    title,
    subTitle,
    isFirstInSection,
    isLastInSection,
    variant,
    className,
    androidRootClassName,
    titleClassName,
    titleStyle,
    textNumberOfLines,
    subTitleStyle,
    subTitleClassName,
    subTitleNumberOfLines,
    textContentClassName,
    sectionHeaderAsGap,
    removeSeparator = false,
    leftView,
    rightView,
    disabled,
    ...props
  }: ListItemProps<T>,
  ref: ListItemRef,
) {
  const displayTitle =
    title ?? (typeof item === "object" ? (item as ListItemData)?.title : undefined)
  const displaySubTitle =
    subTitle ?? (typeof item === "object" ? (item as ListItemData)?.subTitle : undefined)

  return (
    <>
      <Button
        disabled={disabled || !isPressable(props)}
        variant="plain"
        size="none"
        unstable_pressDelay={100}
        androidRootClassName={androidRootClassName}
        className={itemVariants({
          variant,
          sectionHeaderAsGap,
          isFirstInSection,
          isLastInSection,
          disabled,
          className,
          removeSeparator,
        })}
        {...props}
        ref={ref}
      >
        <TextClassContext.Provider value={{ variant: "body" }}>
          {!!leftView && <View>{leftView}</View>}
          <View
            className={cn(
              "h-full flex-1 flex-row items-center pr-2",
              !displaySubTitle ? "py-2" : "",
              !leftView && "ml-4",
              !rightView && "pr-2",
              !removeSeparator &&
                (!isLastInSection || variant === "full-width") &&
                "border-b border-border/80",
              !removeSeparator &&
                isFirstInSection &&
                variant === "full-width" &&
                "border-t border-border/80",
              isFirstInSection && "pt-2",
            )}
          >
            <View className={cn("flex-1 justify-center", textContentClassName)}>
              <Text numberOfLines={textNumberOfLines} style={titleStyle} className={titleClassName}>
                {displayTitle}
              </Text>
              {!!displaySubTitle && (
                <Text
                  numberOfLines={subTitleNumberOfLines}
                  variant="subhead"
                  style={subTitleStyle}
                  className={subTitleClassName}
                >
                  {displaySubTitle}
                </Text>
              )}
            </View>
            {!!rightView && <View>{rightView}</View>}
          </View>
        </TextClassContext.Provider>
      </Button>
      {!removeSeparator && Platform.OS !== "ios" && !isLastInSection && (
        <View className={cn(variant === "insets" && "px-4")}>
          <View className="bg-border/25 dark:bg-border/80 h-px" />
        </View>
      )}
    </>
  )
}

const ListItem = React.forwardRef(ListItemComponent) as <T>(
  props: ListItemProps<T> & { ref?: ListItemRef },
) => React.ReactElement

type ListSectionHeaderProps<T extends ListDataItem> = ViewProps &
  ListRenderItemProps<T> & {
    textClassName?: string
  }
type ListSectionHeaderRef = React.Ref<View>

function ListSectionHeaderComponent<T extends ListDataItem>(
  {
    item,
    variant,
    className,
    textClassName,
    sectionHeaderAsGap,
    ...props
  }: ListSectionHeaderProps<T>,
  ref: ListSectionHeaderRef,
) {
  if (typeof item !== "string") {
    console.log(
      "List.tsx",
      "ListSectionHeaderComponent",
      "Invalid item provided. Expected type 'string'. Use ListItem instead.",
    )
    return null
  }

  if (sectionHeaderAsGap) {
    return (
      <View
        className={cn(
          "bg-background",
          Platform.OS !== "ios" && "border-border/25 dark:border-border/80 border-b",
          className,
        )}
        {...props}
        ref={ref}
      >
        <View className="h-8" />
      </View>
    )
  }
  return (
    <View
      className={cn(
        "pb-1 pl-4 pt-4",
        Platform.OS !== "ios" && "border-border/25 dark:border-border/80 border-b",
        variant === "full-width" ? "bg-card dark:bg-background" : "bg-background",
        className,
      )}
      {...props}
      ref={ref}
    >
      <Text variant="footnote" className={cn("uppercase ", textClassName)}>
        {item}
      </Text>
    </View>
  )
}

const ListSectionHeader = React.forwardRef(ListSectionHeaderComponent) as <T extends ListDataItem>(
  props: ListSectionHeaderProps<T> & { ref?: ListSectionHeaderRef },
) => React.ReactElement

const ESTIMATED_ITEM_HEIGHT = {
  titleOnly: 45,
  withSubTitle: 56,
}

function getStickyHeaderIndices<T extends ListDataItem>(data: T[]) {
  if (!data) return []
  const indices: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      indices.push(i)
    }
  }
  return indices
}

export { ESTIMATED_ITEM_HEIGHT, List, ListItem, ListSectionHeader, getStickyHeaderIndices }
export type { ListDataItem, ListItemProps, ListProps, ListRenderItemInfo, ListSectionHeaderProps }
