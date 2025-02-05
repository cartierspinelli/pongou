import { Platform } from "react-native"
import { Edge, EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"

export type ExtendedEdge = Edge | "start" | "end"

const propertySuffixMap = {
  top: "Top",
  bottom: "Bottom",
  left: "Start",
  right: "End",
  start: "Start",
  end: "End",
}

const edgeInsetMap: Record<string, Edge> = {
  start: "left",
  end: "right",
}

export type SafeAreaInsetsStyle<
  Property extends "padding" | "margin" = "padding",
  Edges extends Array<ExtendedEdge> = Array<ExtendedEdge>,
> = {
  [K in Edges[number] as `${Property}${Capitalize<K>}`]: number
}

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 * @param {ExtendedEdge[]} safeAreaEdges - The edges to apply the safe area insets to.
 * @param {"padding" | "margin"} property - The property to apply the safe area insets to.
 * @returns {SafeAreaInsetsStyle<Property, Edges>} - The style object with the safe area insets applied.
 */
export function useSafeAreaInsetsStyle<
  Property extends "padding" | "margin" = "padding",
  Edges extends Array<ExtendedEdge> = [],
>(
  safeAreaEdges: Edges = [] as unknown as Edges,
  property: Property = "padding" as Property,
): SafeAreaInsetsStyle<Property, Edges> {
  const insets = useSafeAreaInsets()

  const webIOSInsets = {
    top: 40,
    bottom: 0,
    left: 0,
    right: 0,
  }

  const platformInsets = Platform.select({
    web: webIOSInsets,
    default: insets,
  })

  return safeAreaEdges.reduce((acc, e) => {
    const value = edgeInsetMap[e] ?? e
    return { ...acc, [`${property}${propertySuffixMap[e]}`]: platformInsets[value] }
  }, {}) as SafeAreaInsetsStyle<Property, Edges>
}