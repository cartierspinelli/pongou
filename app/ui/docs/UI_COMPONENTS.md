# UI Components Documentation

### Screen

- **Description**: Base wrapper component for all screens with support for scrolling, keyboard handling, and safe areas.
- **Props**:
  - `style?`: StyleProp<ViewStyle>
  - `contentContainerStyle?`: StyleProp<ViewStyle>
  - `contentContainerClassName?`: string
  - `safeAreaEdges?`: ExtendedEdge[]
  - `className?`: string
  - `preset?`: "fixed" | "scroll" | "auto" (default: "fixed")
  - For scroll preset:
    - `keyboardShouldPersistTaps?`: "handled" | "always" | "never" (default: "handled")
    - `ScrollViewProps?`: ScrollViewProps
  - For auto preset:
    - `scrollEnabledToggleThreshold?`: { percent?: number; point?: number } (default: { percent: 0.92 })

### Modal

- **Props**:
  - `width?`: DimensionValue (default: "100%")
  - `height?`: DimensionValue
  - `className?`: string
  - `containerClassName?`: string
  - `visible`: boolean (required)
  - `onClose`: () => void (required)
  - `closeButton?`: boolean (default: false)
  - `tapToClose?`: boolean (default: true)

### Checkbox

- **Props**:
  - `label`: string (required)
  - `checked`: boolean (required)
  - `onValueChange`: (checked: boolean) => void (required)
  - `containerClassName?`: string (default: "")
  - `textClassName?`: string (default: "")
  - `checkboxPosition?`: "left" | "right" (default: "left")
  - `renderLabel?`: (isChecked: boolean) => React.ReactNode

### CheckboxGroup

- **Props**:
  - `options`: { label: string; value: string; renderLabel?: (isSelected: boolean) => React.ReactNode }[] (required)
  - `selectedValues`: string[] (required)
  - `onValueChange`: (values: string[]) => void (required)
  - `containerClassName?`: string (default: "")
  - `optionClassName?`: string (default: "")
  - `textClassName?`: string (default: "")
  - `checkboxPosition?`: "left" | "right" (default: "left")

### RadioGroupItem (value: string)

### RadioGroup

- **Props**:
  - `value`: string | undefined
  - `onValueChange`: (value: string) => void

### SocialLoginButton

- **Props**:
  - `type`: "apple" | "google" | "email" | "facebook" (required)
  - `label?`: string (default: predefined label based on type)
  - `onPress?`: () => void
  - `className?`: string (default: "")

### Button

- **Props**:
  - `variant?`: ’default’ | ‘destructive’ | ‘secondary’ | ‘link’ | ‘outline’ | ‘ghost’
  - `size?`: ’default’ | ‘sm’ | ‘lg’ | ‘icon’
  - All standard PressableProps

### DatePicker

- **Props**:
  - `mode`: "date" | "time" | "datetime" (required)
  - `value`: Date (required)
  - `onChange`: (event: any, date?: Date) => void (required)

### ProgressIndicator

- **Description**: Animated progress bar component
- **Props**:
  - `value`: number (required)
  - `max?`: number (default: 100)
  - `getValueLabel?`: (value: number, max: number) => string
  - `className?`: string

### RangeSlider

- **Description**: Dual-thumb slider for selecting ranges
- **Props**:
  - `values`: [number, number] (required)
  - `min`: number (required)
  - `max`: number (required)
  - `step?`: number (default: 1)
  - `onValuesChange`: (values: [number, number]) => void (required)
  - `containerClassName?`: string
  - `sliderLength?`: number (default: 280)

### Slider

- **Description**: Platform-adaptive slider component
- **Props**:
  - `thumbTintColor?`: string
  - All standard React Native Slider props

### TextArea (Extends TextInput)

### Input (Extends TextInput)

### Text

- **Props**:
  - `variant?`: "largeTitle" | "title1" | "title2" | "title3" | "heading" | "body" | "callout" | "subhead" | "footnote" | "caption1" | "caption2"
  - `customColor?`: string
  - `className?`: string

### BottomSheetModal

- **Description**: Bottom sheet component with backdrop and customizable styling
- **Props**:
  - `index?`: number (default: 0)
  - `backgroundStyle?`: ViewStyle
  - `handleIndicatorStyle?`: ViewStyle
  - `className?`: string
  - All standard BottomSheetModal props

### Adaptive Header

- **Props**:
  - `iosTitle?`: string
  - `searchBar?`: { placeholder: string; onChangeText: (text: string) => void }
  - `leftView?`: () => React.ReactNode - Custom left view component
  - `rightView?`: () => React.ReactNode - Custom right view component

### Separator

Creates a visual or semantic distinction between content.

- **Props**:
  Extends View Props
  - `orientation?`: "horizontal" | "vertical" (default: "horizontal")
  - `decorative?`: boolean (default: true)
  - `asChild?`: boolean (default: false)

### Accordian

A vertically stacked set of interactive headings that each reveal a section of content.
AccordionContent,
AccordionItem {value: string},
AccordionTrigger,

- **Props**:
  - `type?`: ‘single’ | ‘multiple’
  - `asChild?`: boolean (optional)
  - `defaultValue?`: (string | undefined) | string[] (optional)
  - `value?`: (string | undefined) | string[] (optional)
  - `onValueChange?`: ((string | undefined) => void) | ((string[]) => void)

### Table/TableHeader/TableRow/TableHead/TableBody/TableCell/TableFooter

### Avatar props {alt}

### AvatarImage (ext. Image except alt)

### AvatarFallback

### Image

### Card | CardHeader | CardFooter | CardContent | CardTitle | CardDescription

### Badge, variant?: ’default’ | ‘secondary’ | ‘destructive’ | ‘outline’

### Theming & Lib

- **Import**:

```typescript
import { useTheme } from "@/app/ui/theme/useTheme"
import { cn } from "@/app/ui/lib/cn"
```
